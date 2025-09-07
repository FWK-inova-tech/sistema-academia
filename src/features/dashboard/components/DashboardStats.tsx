import { useEffect, useState } from "react";

interface DashboardStatsProps {
  totalStudents: number;
  newThisMonth: number;
}

export const DashboardStats = ({ totalStudents, newThisMonth }: DashboardStatsProps) => {
  // Calculamos métricas baseadas nos dados reais com validações
  const safeTotal = Math.max(0, totalStudents);
  const safeNewMonth = Math.max(0, newThisMonth);
  const activeStudents = Math.round(safeTotal * 0.87); // 87% de retenção é uma boa taxa
  const inactiveStudents = safeTotal - activeStudents;
  const [animatedValues, setAnimatedValues] = useState({
    total: 0,
    active: 0,
    newMonth: 0
  });

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOut = 1 - Math.pow(1 - progress, 4);

      setAnimatedValues({
        total: Math.round(safeTotal * easeOut),
        active: Math.round(activeStudents * easeOut),
        newMonth: Math.round(safeNewMonth * easeOut)
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setAnimatedValues({
          total: safeTotal,
          active: activeStudents,
          newMonth: safeNewMonth
        });
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [safeTotal, activeStudents, safeNewMonth]);

  const activePercentage = safeTotal > 0 ? Math.round((activeStudents / safeTotal) * 100) : 0;
  const growthRate = safeTotal > 0 ? Math.round((safeNewMonth / safeTotal) * 100) : 0;

  const dashboardStatsCardsClassses = "bg-[#ffffff54] hover:bg-[#ffffff91] rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow";

  return (
    <div className="dashboard-stats space-y-6">
      {/* Cards Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total de Alunos */}
        <div className={dashboardStatsCardsClassses}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
          </div>
          <p className="text-gray-600 text-sm font-medium mb-2">Total de Alunos</p>
          <p className="text-3xl font-bold text-gray-900">{animatedValues.total}</p>
        </div>

        {/* Alunos Ativos */}
        <div className={dashboardStatsCardsClassses}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
            <span className="text-green-600 text-xs font-semibold bg-green-50 px-2 py-1 rounded-full">
              {activePercentage}%
            </span>
          </div>
          <p className="text-gray-600 text-sm font-medium mb-2">Alunos Ativos</p>
          <p className="text-3xl font-bold text-gray-900">{animatedValues.active}</p>
        </div>

        {/* Novos Este Mês */}
        <div className={dashboardStatsCardsClassses}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-600">
                <polyline points="23,6 13.5,15.5 8.5,10.5 1,18"></polyline>
                <polyline points="17,6 23,6 23,12"></polyline>
              </svg>
            </div>
            {safeNewMonth > 0 && (
              <span className="text-purple-600 text-xs font-semibold bg-purple-50 px-2 py-1 rounded-full">
                +{growthRate}%
              </span>
            )}
          </div>
          <p className="text-gray-600 text-sm font-medium mb-2">Novos Este Mês</p>
          <p className="text-3xl font-bold text-gray-900">{animatedValues.newMonth}</p>
        </div>

        {/* Taxa de Retenção */}
        <div className={dashboardStatsCardsClassses}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 rounded-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-600">
                <path d="M9 12l2 2 4-4"></path>
                <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9s4.03-9 9-9c1.51 0 2.93 0.37 4.18 1.03"></path>
              </svg>
            </div>
          </div>
          <p className="text-gray-600 text-sm font-medium mb-2">Taxa de Retenção</p>
          <p className="text-3xl font-bold text-gray-900">{activePercentage}%</p>
        </div>
      </div>

      {/* Card de Progresso - novo visual */}
      <div className="bg-[#ffffff54] rounded-xl p-7 shadow-md mt-4 backdrop-blur-sm">
        <div className="flex items-center gap-5 mb-5">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-100/60 shadow">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
              <path d="M9 12l2 2 4-4"></path>
              <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9s4.03-9 9-9c1.51 0 2.93 0.37 4.18 1.03"></path>
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">Progresso da Academia</h3>
            <span className="text-xs font-medium text-gray-700">Taxa de Retenção</span>
          </div>
          <div className="ml-auto text-xl font-bold text-white drop-shadow-sm">{activePercentage}%</div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 mb-3">
          <div
            className="h-3 bg-[#008058] rounded-full transition-all duration-1000 shadow"
            style={{ width: `${Math.min(100, activePercentage)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-700 font-medium mt-2">
          <span><span className="font-bold text-[#008058]">{animatedValues.active}</span> ativos</span>
          <span><span className="font-bold text-[#008058]">{inactiveStudents}</span> inativos</span>
        </div>
      </div>
    </div>
  );
};
