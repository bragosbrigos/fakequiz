import { ScheduledMatchesCalendar } from '../components/matches/ScheduledMatchesCalendar';

export function Matches() {
  return (
    <div className="pt-24 pb-12 min-h-screen animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScheduledMatchesCalendar />
      </div>
    </div>
  );
}
