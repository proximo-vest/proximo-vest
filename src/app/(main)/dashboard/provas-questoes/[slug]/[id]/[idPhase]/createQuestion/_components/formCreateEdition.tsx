"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import MarkdownIt from "markdown-it";
import { useUploadFile } from "@better-upload/client";
import "react-markdown-editor-lite/lib/index.css";
const MdEditor = dynamic(() => import("react-markdown-editor-lite"), {
  ssr: false,
});

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch"; // ainda não está sendo usado
import { toast } from "sonner";

type CreateQuestionFormProps = {
  isDiscursive: boolean;
  examPhaseId: number;
  defaultOptionCount: number; // 4 ou 5
};

const mdParser = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: true,
});

// Lista fixa de subjects (name + slug)
const SUBJECTS = [
  { slug: "matematica", name: "Matemática" },
  { slug: "geometria-plana", name: "Geometria Plana" },
  { slug: "geometria-espacial", name: "Geometria Espacial" },
  { slug: "interpretacao-texto", name: "Interpretação de Texto" },
  { slug: "fisica", name: "Física" },
  { slug: "quimica", name: "Química" },
  { slug: "biologia", name: "Biologia" },
];

// ---------------- Schemas ----------------
const baseSchema = z.object({
  examPhaseId: z.number(),
  numberLabel: z.string().min(1, "Obrigatório"),

  // Agora subjects é array de slugs
  subjects: z.array(z.string()).optional(),
  skills: z.string().optional(), // "H01,H02"

  stimulusText: z.string().min(1, "O estímulo é obrigatório"),
  stimulusSourceRef: z.string().optional(),
});

/** Objetiva (MCQ) */
const mcqSchema = baseSchema
  .extend({
    optionCount: z.enum(["4", "5"]),
    shuffleOptions: z.boolean().default(true),
    correctOptionKey: z.enum(["A", "B", "C", "D", "E"]),

    optionA: z.string().min(1, "Obrigatório"),
    optionB: z.string().min(1, "Obrigatório"),
    optionC: z.string().min(1, "Obrigatório"),
    optionD: z.string().min(1, "Obrigatório"),
    optionE: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    if (values.optionCount === "5" && !values.optionE?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["optionE"],
        message: "Obrigatório",
      });
    }

    const count = Number(values.optionCount);
    const allowed = ["A", "B", "C", "D"].concat(count === 5 ? ["E"] : []);
    if (!allowed.includes(values.correctOptionKey)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["correctOptionKey"],
        message: `A alternativa correta precisa estar entre as ${count} cadastradas.`,
      });
    }
  });

/** Discursiva (FR) */
const frSchema = baseSchema.extend({
  frMaxScore: z.coerce.number().min(0, "Informe a nota máxima"),
  frAnswerGuidanceHtml: z.string().optional(),
  frExpectedAnswerHtml: z
    .string()
    .min(1, "Informe pelo menos uma resposta modelo"),
});

export function CreateQuestionForm({
  isDiscursive,
  examPhaseId,
  defaultOptionCount,
}: CreateQuestionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema = useMemo(
    () => (isDiscursive ? frSchema : mcqSchema),
    [isDiscursive]
  );

  const form = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: {
      examPhaseId,
      numberLabel: "",
      subjects: [] as string[],
      skills: "",
      stimulusText: "",
      stimulusSourceRef: "",

      // defaults da parte objetiva
      optionCount: String(defaultOptionCount ?? 5), // vem da prop
      shuffleOptions: true,
      correctOptionKey: "A",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      optionE: "",

      // defaults da parte discursiva
      frMaxScore: 10,
      frAnswerGuidanceHtml: "",
      frExpectedAnswerHtml: "",
    },
  });

  const optionCount = form.watch("optionCount");
  const hasOptionE = defaultOptionCount === 5; // controla E por prop

  const { uploadAsync, isPending: isUploadingImage } = useUploadFile({
    route: "markdown-images",
  });

  const handleMarkdownImageUpload = async (file: File): Promise<string> => {
    console.log(file);
    const uploaded = (await uploadAsync(file)) as any;

    console.log("UPLOAD RESULT:", uploaded.file.objectInfo.key);

    if (!uploaded.file.objectInfo.key) {
      console.error(uploaded.error);
      throw new Error("Upload falhou: nenhuma key retornada.");
    }

    const key = uploaded.file.objectInfo.key;

    const url = `${process.env.NEXT_PUBLIC_R2_S3_ENDPOINT!}/${key}`;

    return url; // markdown recebe ![](url)
  };

  async function onSubmit(values: any) {
    try {
      setIsSubmitting(true);

      const subjectsArray =
        values.subjects && values.subjects.length > 0
          ? (values.subjects as string[])
          : undefined;

      const skillsArray = values.skills
        ? values.skills.split(",").map((s: string) => s.trim()).filter(Boolean)
        : undefined;

      const stimulus = {
        contentHtml: values.stimulusText,
        contentText: undefined,
        sourceRef: values.stimulusSourceRef || undefined,
      };

      const payload: any = {
        examPhaseId: values.examPhaseId,
        numberLabel: values.numberLabel,
        isDiscursive,
        subjects: subjectsArray,
        skills: skillsArray,
        stimulus,
      };

      if (!isDiscursive) {
        const count = Number(values.optionCount); // 4 ou 5

        const options = [
          { label: "A", textPlain: values.optionA },
          { label: "B", textPlain: values.optionB },
          { label: "C", textPlain: values.optionC },
          { label: "D", textPlain: values.optionD },
          ...(count === 5 && values.optionE
            ? [{ label: "E", textPlain: values.optionE }]
            : []),
        ];

        payload.mcq = {
          optionCount: count,
          shuffleOptions: values.shuffleOptions,
          correctOptionKey: values.correctOptionKey,
          options,
        };
      } else {
        payload.fr = {
          maxScore: values.frMaxScore,
          answerGuidanceHtml: values.frAnswerGuidanceHtml || undefined,
          expectedAnswers: [
            {
              label: "Modelo",
              answerHtml: values.frExpectedAnswerHtml,
              maxScore: values.frMaxScore,
            },
          ],
        };
      }

      const res = await fetch("/api/question/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error?.message || "Erro ao criar questão.");
      }

      const created = await res.json();
      toast.success(`Questão criada com sucesso! ID: ${created.id}`);

      form.reset({
        ...form.getValues(),
        numberLabel: "",
        subjects: [],
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        optionE: "",
        frExpectedAnswerHtml: "",
      });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Erro inesperado ao criar questão.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Dados básicos */}
        <div className="space-y-4 rounded-md border p-4">
          <h2 className="text-sm font-semibold">Dados da questão</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="numberLabel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número da questão</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 1, 10, 5A..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Subjects como multi-select de bloquinhos */}
          <FormField
            control={form.control}
            name="subjects"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subjects</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {SUBJECTS.map((subject) => {
                        const selected = (field.value || []).includes(
                          subject.slug
                        );

                        return (
                          <button
                            key={subject.slug}
                            type="button"
                            className={[
                              "rounded-full border px-3 py-1 text-sm transition",
                              selected
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-muted text-muted-foreground hover:bg-accent",
                            ].join(" ")}
                            onClick={() => {
                              const current: string[] = field.value || [];
                              if (selected) {
                                field.onChange(
                                  current.filter(
                                    (s: string) => s !== subject.slug
                                  )
                                );
                              } else {
                                field.onChange([...current, subject.slug]);
                              }
                            }}
                          >
                            {subject.name}
                          </button>
                        );
                      })}
                    </div>

                    {field.value && field.value.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {field.value.map((slug: string) => {
                          const subject = SUBJECTS.find(
                            (s) => s.slug === slug
                          );
                          return (
                            <span
                              key={slug}
                              className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs"
                            >
                              {subject?.name ?? slug}
                              <button
                                type="button"
                                className="ml-1 text-xs"
                                onClick={() =>
                                  field.onChange(
                                    field.value.filter(
                                      (s: string) => s !== slug
                                    )
                                  )
                                }
                              >
                                ✕
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skills (códigos, separados por vírgula)</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: H01,H15" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Estímulo */}
        <div className="space-y-4 rounded-md border p-4">
          <h2 className="text-sm font-semibold">Estímulo</h2>

          <FormField
            control={form.control}
            name="stimulusText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Texto do estímulo (Markdown)</FormLabel>
                <FormControl>
                  <div className="border rounded-md overflow-hidden">
                    <MdEditor
                      style={{ height: 300 }}
                      value={field.value || ""}
                      renderHTML={(text) => mdParser.render(text)}
                      onChange={({ text }) => field.onChange(text)}
                      onImageUpload={handleMarkdownImageUpload}
                      config={{
                        view: {
                          menu: true,
                          md: true,
                          html: true,
                        },
                        canView: {
                          menu: true,
                          md: true,
                          html: true,
                          both: true,
                          fullScreen: true,
                          hideMenu: true,
                        },
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stimulusSourceRef"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Referência da fonte</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: ENEM 2023 - Prova Azul" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* MCQ */}
        {!isDiscursive && (
          <div className="space-y-4 rounded-md border p-4">
            <h2 className="text-sm font-semibold">
              Questão objetiva (MCQ) – {defaultOptionCount} alternativas
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="correctOptionKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alternativa correta</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["A", "B", "C", "D"].map((letter) => (
                          <SelectItem key={letter} value={letter}>
                            {letter}
                          </SelectItem>
                        ))}
                        {hasOptionE && <SelectItem value="E">E</SelectItem>}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="optionA"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alternativa A</FormLabel>
                    <FormControl>
                      <Input placeholder="Texto da alternativa A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="optionB"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alternativa B</FormLabel>
                    <FormControl>
                      <Input placeholder="Texto da alternativa B" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="optionC"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alternativa C</FormLabel>
                    <FormControl>
                      <Input placeholder="Texto da alternativa C" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="optionD"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alternativa D</FormLabel>
                    <FormControl>
                      <Input placeholder="Texto da alternativa D" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {hasOptionE && (
                <FormField
                  control={form.control}
                  name="optionE"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alternativa E</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Texto da alternativa E"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>
        )}

        {/* Discursiva */}
        {isDiscursive && (
          <div className="space-y-4 rounded-md border p-4">
            <h2 className="text-sm font-semibold">Questão discursiva (FR)</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="frMaxScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nota máxima (maxScore)</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} step="0.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="frAnswerGuidanceHtml"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Orientação ao corretor (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: considerar domínio da norma culta..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="frExpectedAnswerHtml"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resposta modelo</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Cole aqui uma resposta exemplo / gabarito comentado..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Criando..." : "Criar questão"}
        </Button>
      </form>
    </Form>
  );
}
