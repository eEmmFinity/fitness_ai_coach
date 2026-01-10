import connectDB from '@/lib/db';
import Exercise from '@/models/Exercise';
import { EXERCISES } from './exerciseData';

/**
 * Seed the database with exercise library
 * Run this script once to populate the exercise database
 */
export async function seedExercises() {
  try {
    await connectDB();

    // Check if exercises already exist
    const existingCount = await Exercise.countDocuments({ isCustom: false });

    if (existingCount > 0) {
      console.log(`✅ Exercise library already populated (${existingCount} exercises found)`);
      return { success: true, count: existingCount, message: 'Already seeded' };
    }

    console.log('🌱 Seeding exercise library...');

    // Insert all exercises
    const result = await Exercise.insertMany(EXERCISES);

    console.log(`✅ Successfully seeded ${result.length} exercises!`);

    // Log breakdown by category
    const breakdown = await Exercise.aggregate([
      { $match: { isCustom: false } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    console.log('\n📊 Exercise Breakdown:');
    breakdown.forEach(({ _id, count }) => {
      console.log(`   ${_id}: ${count} exercises`);
    });

    return {
      success: true,
      count: result.length,
      message: 'Seeded successfully',
      breakdown
    };

  } catch (error) {
    console.error('❌ Error seeding exercises:', error);
    throw error;
  }
}

// Allow running directly
if (require.main === module) {
  seedExercises()
    .then(() => {
      console.log('\n✨ Seeding complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}
