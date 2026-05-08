import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Exercise from '@/models/Exercise';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';
import { seedExercises } from '@/lib/exercises/seedExercises';

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// GET /api/exercises - Get all exercises with filtering, search, and pagination
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Auto-seed if no exercises exist
    const count = await Exercise.countDocuments();
    if (count === 0) {
      console.log('No exercises found, seeding database...');
      await seedExercises();
    }

    const searchParams = request.nextUrl.searchParams;

    // Extract query parameters
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const muscleGroup = searchParams.get('muscleGroup') || '';
    const equipment = searchParams.get('equipment') || '';
    const difficulty = searchParams.get('difficulty') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build filter query
    const filter: Record<string, unknown> = {};

    if (search) {
      const safeSearch = escapeRegex(search);
      filter.$or = [
        { name: { $regex: safeSearch, $options: 'i' } },
        { description: { $regex: safeSearch, $options: 'i' } },
        { muscleGroups: { $in: [new RegExp(safeSearch, 'i')] } },
      ];
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Muscle group filter
    if (muscleGroup) {
      filter.muscleGroups = { $in: [muscleGroup] };
    }

    // Equipment filter
    if (equipment) {
      if (equipment === 'none') {
        filter.equipment = { $in: ['none'] };
      } else {
        filter.equipment = { $in: [equipment] };
      }
    }

    // Difficulty filter
    if (difficulty) {
      filter.difficulty = difficulty;
    }

    // Get user's custom exercises if authenticated
    const token = request.cookies.get('token')?.value;
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        // Include both system and user's custom exercises
        const existing = (filter.$or as unknown[]) || [];
        filter.$or = [
          ...existing,
          { isCustom: false },
          { isCustom: true, createdBy: decoded.userId },
        ];
      } else {
        // Not authenticated, only show system exercises
        filter.isCustom = false;
      }
    } else {
      // Not authenticated, only show system exercises
      filter.isCustom = false;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [exercises, total] = await Promise.all([
      Exercise.find(filter)
        .select('-__v')
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Exercise.countDocuments(filter)
    ]);

    const pages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        exercises,
        pagination: {
          total,
          page,
          pages,
          limit,
          hasMore: page < pages
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Get exercises error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/exercises - Create custom exercise (requires authentication)
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Verify authentication
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const {
      name,
      category,
      muscleGroups,
      equipment,
      difficulty,
      description
    } = body;

    if (!name || !category || !muscleGroups || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create custom exercise
    const exercise = new Exercise({
      name,
      category,
      muscleGroups: Array.isArray(muscleGroups) ? muscleGroups : [muscleGroups],
      equipment: equipment || ['none'],
      difficulty: difficulty || 'beginner',
      description,
      instructions: body.instructions || [],
      tips: body.tips || [],
      videoUrl: body.videoUrl,
      imageUrl: body.imageUrl,
      caloriesPerRep: body.caloriesPerRep || 1,
      isCustom: true,
      createdBy: decoded.userId
    });

    await exercise.save();

    // Add to user's custom exercises
    await User.findByIdAndUpdate(
      decoded.userId,
      { $addToSet: { customExercises: exercise._id } }
    );

    return NextResponse.json(
      {
        message: 'Custom exercise created successfully',
        exercise
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Create exercise error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
