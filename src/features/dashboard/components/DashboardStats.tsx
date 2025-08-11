import { StatCard } from "../../../components/ui/StatCard/StatCard";
import { Card } from "../../../components/ui/Card/Card";

interface DashboardStatsProps {
  totalStudents: number;
  activeStudents: number;
  newThisMonth: number;
}

export const DashboardStats = ({ totalStudents, activeStudents, newThisMonth }: DashboardStatsProps) => {
  const UsersIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  );

  const ActivityIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"></polyline>
    </svg>
  );

  const TrendUpIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23,6 13.5,15.5 8.5,10.5 1,18"></polyline>
      <polyline points="17,6 23,6 23,12"></polyline>
    </svg>
  );

  const activePercentage = totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0;

  return (
    <div className="dashboard-stats space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total de Alunos"
          value={totalStudents}
          icon={<UsersIcon />}
          color="green"
        />
        
        <StatCard
          title="Alunos Ativos"
          value={activeStudents}
          icon={<ActivityIcon />}
          color="green"
        />
        
        <StatCard
          title="Novos Este Mês"
          value={newThisMonth}
          icon={<TrendUpIcon />}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumo da Academia</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Taxa de Retenção</span>
              <span className="font-semibold text-green-600">{activePercentage}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total de Alunos Cadastrados</span>
              <span className="font-semibold text-gray-800">{totalStudents}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
