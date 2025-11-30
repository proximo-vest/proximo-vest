import { StudentDashboard } from "./_components/student-dashboard";
  import { Separator } from "@/components/ui/separator";
import { TeacherDashboard } from "./_components/teacher-dashboard";
// No próximo passo, vamos decidir qual mostrar com base no tipo de usuário.

export default async function DashboardPage() {
  // TODO: pegar usuário logado de fato (requirePageAuth / sessão / etc)
  const mockUserName = "Enrico";

  const mockRecentSimulados = [
    {
      id: "1",
      title: "Simulado ENEM completo",
      date: "20/11/2025",
      scorePercent: 78,
    },
    {
      id: "2",
      title: "Simulado Fuvest – 1ª fase",
      date: "15/11/2025",
      scorePercent: 72,
    },
  ];

  const mockUpcomingExams = [
    {
      id: "1",
      name: "ENEM 2026 – Prova 1",
      date: "08/11/2026",
      board: "INEP",
    },
    {
      id: "2",
      name: "Vestibular Unicamp 2026 – 1ª fase",
      date: "22/11/2026",
      board: "Comvest",
    },
  ];

  return (
    <div className="p-4 md:p-6">
      <StudentDashboard
        name={mockUserName}
        overallProgressPercent={75}
        recentSimulados={mockRecentSimulados}
        upcomingExams={mockUpcomingExams}
      />
      <Separator></Separator>

  
      <TeacherDashboard
        name="Enrico"
        overview={{ averageScore: 76, totalStudents: 48, totalSimulados: 12 }}
        lists={[
          {
            id: "1",
            title: "Lista de Matemática – Funções",
            questionsCount: 20,
            createdAt: "01/11/2025",
          },
        ]}
        classes={[
          { id: "1", name: "3º EM A", studentsCount: 25 },
          { id: "2", name: "3º EM B", studentsCount: 23 },
        ]}
      />

    </div>
  );
}
