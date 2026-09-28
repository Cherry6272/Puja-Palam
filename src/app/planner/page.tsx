'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { RitualPlannerWizard } from '@/components/planner/RitualPlannerWizard';

function PlannerContent() {
  const searchParams = useSearchParams();
  const ritualSlug = searchParams.get('ritual') || undefined;

  return <RitualPlannerWizard initialRitualSlug={ritualSlug} />;
}

export default function PlannerPage() {
  return (
    <div className="min-h-screen py-10 bg-sandalwood-50">
      <Suspense fallback={<div className="text-center py-20 text-xs text-temple-500">Loading Ritual Planner...</div>}>
        <PlannerContent />
      </Suspense>
    </div>
  );
}
