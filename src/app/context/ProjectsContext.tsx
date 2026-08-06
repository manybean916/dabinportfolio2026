import React, { createContext, useContext, useEffect, useState } from 'react';
import { ref, get, push, set, remove, child } from 'firebase/database';
import { db } from '../../lib/firebase';
import projectImg1 from "../../imports/KakaoTalk_20260415_175036426.jpg";
import projectImg2 from "../../imports/스크린샷(5).png";

export interface Project {
  id?: string;
  title: string;
  titleEn?: string;
  category: string;
  imageUrl: string;
  description?: string;
  prototypeLink?: string;
  githubLink?: string;
  date?: string;
  collaborators?: string;
  keywords?: string[];
  subject?: string;
  workNotes?: string;
  createdAt?: number;
  updatedAt?: number;
}

interface ProjectsContextType {
  projects: Project[];
  isLoading: boolean;
  saveProject: (project: Project, editingIndex: number | null) => Promise<void>;
  deleteProject: (index: number) => Promise<void>;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

const initialProjects: Project[] = [
  {
    id: "project:1",
    title: "2026 UX 리서치 전략 심층 인터뷰",
    category: "UX Research",
    imageUrl: projectImg1,
  },
  {
    id: "project:2",
    title: "stakeholder분석 및 대시보드 제작",
    category: "Product Design",
    imageUrl: projectImg2,
    prototypeLink: "https://service-2026-foldable-market-super-cycle-dashboar-152446546512.us-west1.run.app",
  },
  {
    id: "project:3",
    title: "페르소나설정 실습",
    category: "E-commerce",
    imageUrl: "https://ik.imagekit.io/cuquvvrdw/bwan/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7(2).png",
    prototypeLink: "https://morph-thing-84845400.figma.site",
  },
];

const sortByUpdated = (list: Project[]) =>
  [...list].sort((a, b) => {
    const timeA = a.updatedAt || 0;
    const timeB = b.updatedAt || 0;
    if (timeA !== timeB) return timeB - timeA;
    if ((b.id || '') > (a.id || '')) return 1;
    if ((b.id || '') < (a.id || '')) return -1;
    return 0;
  });

export const ProjectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const dbRef = ref(db);
      const snapshot = await get(child(dbRef, "projects"));

      if (snapshot.exists()) {
        const data: Project[] = [];
        snapshot.forEach((childSnapshot) => {
          data.push({ id: childSnapshot.key!, ...childSnapshot.val() });
        });
        setProjects(sortByUpdated(data));
      } else {
        // DB가 비어있을 경우 그냥 빈 배열로 유지 (자동 덮어쓰기 하지 않음)
        console.log("No projects found in DB.");
        setProjects([]);
      }
    } catch (error) {
      console.error("Error fetching projects, falling back to local state:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const saveProject = async (newProject: Project, editingIndex: number | null) => {
    const now = Date.now();

    if (editingIndex !== null) {
      const projectId = projects[editingIndex].id;
      const updatedProject: Project = { ...newProject, updatedAt: now };

      if (projects[editingIndex].createdAt) {
        updatedProject.createdAt = projects[editingIndex].createdAt;
      }

      try {
        await set(ref(db, `projects/${projectId}`), updatedProject);
      } catch (e) {
        console.warn("Database update failed, updating local state only");
      }

      const updated = [...projects];
      updated[editingIndex] = { ...updatedProject, id: projectId };
      setProjects(sortByUpdated(updated));
    } else {
      let newId = `local-${now}`;
      const newProjectWithTime: Project = { ...newProject, createdAt: now, updatedAt: now };

      try {
        const newProjectRef = push(ref(db, "projects"));
        await set(newProjectRef, newProjectWithTime);
        if (newProjectRef.key) newId = newProjectRef.key;
      } catch (e) {
        console.warn("Database add failed, using local state only");
      }

      setProjects(sortByUpdated([{ ...newProjectWithTime, id: newId }, ...projects]));
    }
  };

  const deleteProject = async (index: number) => {
    const projectToDelete = projects[index];
    try {
      await remove(ref(db, `projects/${projectToDelete.id}`));
    } catch (e) {
      console.warn("Database delete failed, deleting from local state only");
    }
    setProjects(projects.filter((_, i) => i !== index));
  };

  return (
    <ProjectsContext.Provider value={{ projects, isLoading, saveProject, deleteProject }}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
};
