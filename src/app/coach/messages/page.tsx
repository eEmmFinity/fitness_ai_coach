'use client';

import React from 'react';
import { MessagesView } from '@/components/messages/MessagesView';

export default function CoachMessagesPage() {
  return (
    <MessagesView
      emptyTitle="No conversations yet"
      emptyCopy="Once you accept a client request, you can message back and forth here."
    />
  );
}
