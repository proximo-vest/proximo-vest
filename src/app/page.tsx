import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <main className="pt-16 xs:pt-20 sm:pt-24">
            <div className="min-h-[calc(100vh-6rem)] flex flex-col items-center py-20 px-6">
      <div className="md:mt-6 flex items-center justify-center">
        <div className="items-center justify-center text-center max-w-2xl">
          <img
            src="/logo.svg"
            alt="Próximo Vest"
            className="mt-4 w-full max-w-[550px] xs:max-w-[450px] sm:max-w-[550px] md:max-w-[650px] h-auto"
          />
          <p className="mt-4 font-bold max-w-[60ch] xs:text-lg"   style={{ color: "#7209B7" }}>
            A próxima plataforma do vestibulando!
          </p>
          <div className="mt-4 flex flex-col sm:flex-row items-center sm:justify-center gap-4">
            <a href="https://instagram.com/proximovest">
            <Button
              size="lg"
              className="w-full sm:w-auto rounded-full text-base"
            >
              Saiba Mais <ArrowUpRight className="h-5! w-5!" />
            </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
      </main>
    </>
  );
}