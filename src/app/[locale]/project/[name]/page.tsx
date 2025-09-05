"use client";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import RepellingText from "@/components/repellingText";

import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProjectLoading from "@/components/projectLoading";
import { Dialog } from "@headlessui/react"; // Ajoute cette ligne en haut

type ProjectPageProps = {
  name: string;
  technologies?: string[];
  githubLink?: string;
  liveLink?: string;
  date?: string;
  objective?: string;
  responsabilities?: string[];
  obstacles?: string[];
  images?: string[];
};

export default function projectPage() {
  const params = useParams<{ name: string }>();
  const [projectData, setProjectData] = useState<ProjectPageProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [projectPageProps, setProjectPageProps] = useState<ProjectPageProps>({
    name: "",
    technologies: [],
    githubLink: "",
    liveLink: "",
    date: "",
    objective: "",
    responsabilities: [],
    obstacles: [],
    images: [],
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // Ajoute ce state

  useEffect(() => {
    const fetchFile = async () => {
      if (!params?.name) return;
      const res = await fetch(`/projects/${params.name}.json`);
      if (res.ok) {
        const data = await res.json();
        setProjectData(data);
        setProjectPageProps(data);
        console.log(data.images);
        setLoading(false);
      }
    };
    fetchFile();
  }, [params]);
  const t = useTranslations("HomePage");
  return (
    <main className="flex flex-col items-center justify-between px-24 pt-24 w-full">
      <div className="dark p-3 px-15 flex flex-col w-full h-fit glass border border-stone-200/20 hover:border-white/70 transition-all">
        {loading ? (
          <ProjectLoading />
        ) : (
          <>
            <nav className="flex items-center justify-between mb-4">
              <div>
                <RepellingText
                  text={projectPageProps.name}
                  className="font-main font-bold text-4xl w-fit sliding-underline first-line:text-ownAccent"
                  repellingDistance={100}
                  spaceBetweenWords={0}
                />
                <ul className="flex gap-2 mt-2">
                  {projectPageProps.technologies?.map((tech) => (
                    <li key={tech}>
                      <Badge>{tech}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex space-x-2">
                {projectPageProps.githubLink && (
                  <Link
                    className={`${buttonVariants({
                      variant: "outline",
                    })} bg-transparent border border-stone-200/30 transition-all text-white font-main hover:text-black hover:bg-white`}
                    href={projectPageProps.githubLink}
                    target="_blank"
                  >
                    {t("projectsGithub")}
                  </Link>
                )}

                {projectPageProps.liveLink && (
                  <Link
                    className={`${buttonVariants({
                      variant: "outline",
                    })} bg-transparent border border-stone-200/30 transition-all text-white font-main hover:text-black hover:bg-white`}
                    href={projectPageProps.liveLink}
                    target="_blank"
                  >
                    {t("projectsVisit")}
                  </Link>
                )}
              </div>
            </nav>
            <p className="text-stone-200/70 font-main absolute right-20 top-22">
              {projectPageProps.date}
            </p>
            <hr className="my-4 border-stone-200/30" />
            <div className="flex flex-col space-y-8 w-full">
              <section className="w-full">
                {/* <h2>{t("projectsObjective")}</h2> */}
                <RepellingText
                  text={t("projectsObjective")}
                  className="font-main font-bold text-4xl w-fit sliding-underline"
                  repellingDistance={100}
                  spaceBetweenWords={0}
                />

                <p className="text-stone-200/70 font-main">
                  {t(projectPageProps.objective)}
                </p>
              </section>
              <section className="self-center end w-full">
                <RepellingText
                  text={t("projectsRole")}
                  className="font-main font-bold text-4xl w-fit sliding-underline"
                  repellingDistance={100}
                  spaceBetweenWords={0}
                />
                <p className="text-stone-200/70 font-main">
                  {t(projectPageProps.responsabilities)}
                </p>
              </section>
              <section>
                <RepellingText
                  text={t("projectsObstacles")}
                  className="font-main font-bold text-4xl w-fit sliding-underline"
                  repellingDistance={100}
                  spaceBetweenWords={0}
                />
                <p className="text-stone-200/70 font-main">
                  {t(projectPageProps.obstacles)}
                </p>
              </section>
              {projectPageProps.images &&
                projectPageProps.images.length > 0 && (
                  <>
                    <ScrollArea
                      className="dark w-full overflow-x-auto transition-all"
                      orientation="horizontal"
                    >
                      <div className="flex flex-row gap-4 min-w-max">
                        {projectPageProps.images.map((image) => (
                          <div
                            key={image}
                            className="cursor-pointer dark p-3 flex flex-col w-fit h-fit glass border border-stone-200/20 hover:border-white/70 transition-all rounded-md"
                            onClick={() => setSelectedImage(image)} // Ajoute cet onClick
                          >
                            <Image
                              src={`/${projectPageProps.name}/${image}`}
                              alt="Visual of Storyteller Website"
                              width={400}
                              height={200}
                              className=""
                            />
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    {/* Modal d'affichage de l'image */}
                    <Dialog
                      open={!!selectedImage}
                      onClose={() => setSelectedImage(null)}
                      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
                    >
                      <Dialog.Panel className="relative">
                        <button
                          onClick={() => setSelectedImage(null)}
                          className="absolute top-2 right-2 bg-ownAccent rounded-full px-3 py-1 text-black font-bold cursor-pointer"
                        >
                          X
                        </button>
                        {selectedImage && (
                          <Image
                            src={`/${projectPageProps.name}/${selectedImage}`}
                            alt="Agrandissement"
                            width={900}
                            height={600}
                            className="rounded-lg"
                          />
                        )}
                      </Dialog.Panel>
                    </Dialog>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
