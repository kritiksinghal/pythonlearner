/*
 * lib/lessons.ts
 *
 * Data loader and helpers for lessons, modules, and quizzes.
 * Reads Markdown frontmatter and JSON quizzes from /content/lessons/[slug]/
 */

import fs from "fs";
import path from "path";
import type { QuizQuestion } from "@/components/QuizView";

export interface LessonMeta {
  slug: string;
  title: string;
  curriculumTitle?: string;
  track: "Python from zero" | "CS50P";
  module: string;
  order: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  summary: string;
  prerequisites: string[];
  learningGoals: string[];
  relatedProblems: string[];
  readingTime: number; // estimated minutes (words / 200, rounded)
}

export interface Lesson extends LessonMeta {
  content: string;
  quiz: QuizQuestion[];
}

export interface AdjacentLesson {
  slug: string;
  title: string;
}

export interface ModuleGroup {
  moduleName: string;
  lessons: Lesson[];
}

export interface TrackWithModules {
  trackName: "Python from zero" | "CS50P";
  modules: ModuleGroup[];
}

export interface CurriculumLesson {
  trackNumber: number; // overall position within track: 01..50 or 01..10
  title: string;
  isReady: boolean;
  slug?: string;
  summary?: string;
  level?: "Beginner" | "Intermediate" | "Advanced";
  readingTime?: number;
}

export interface CurriculumModule {
  moduleName: string;
  lessons: CurriculumLesson[];
}

export interface CurriculumTrack {
  trackName: "Python from zero" | "CS50P";
  readyCount: number;
  totalCount: number;
  modules: CurriculumModule[];
}

const LESSONS_DIR = path.join(process.cwd(), "content/lessons");
const CURRICULUM_FILE = path.join(process.cwd(), "content/CURRICULUM.md");

/** YAML frontmatter parser handling strings, numbers, and lists without external dependencies */
function parseFrontmatter(raw: string): { data: Record<string, any>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n([\s\S]*))?$/);
  if (!match) {
    return { data: {}, content: raw };
  }

  const yamlText = match[1];
  const content = (match[2] || "").trim();
  const data: Record<string, any> = {};

  const lines = yamlText.split(/\r?\n/);
  let currentKey = "";

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    // List item under currentKey
    if (line.startsWith("  - ") || line.startsWith("- ")) {
      if (currentKey) {
        if (!Array.isArray(data[currentKey])) {
          data[currentKey] = [];
        }
        let itemVal = trimmed.replace(/^[-\s]+/, "").trim();
        if (
          (itemVal.startsWith('"') && itemVal.endsWith('"')) ||
          (itemVal.startsWith("'") && itemVal.endsWith("'"))
        ) {
          itemVal = itemVal.slice(1, -1);
        }
        data[currentKey].push(itemVal);
      }
      continue;
    }

    const colonIdx = line.indexOf(":");
    if (colonIdx !== -1) {
      const key = line.slice(0, colonIdx).trim();
      let val = line.slice(colonIdx + 1).trim();

      currentKey = key;

      if (!val) {
        data[key] = [];
        continue;
      }

      // Inline list e.g. [] or ["a", "b"]
      if (val.startsWith("[") && val.endsWith("]")) {
        const inner = val.slice(1, -1).trim();
        if (!inner) {
          data[key] = [];
        } else {
          data[key] = inner.split(",").map((s) => {
            let item = s.trim();
            if (
              (item.startsWith('"') && item.endsWith('"')) ||
              (item.startsWith("'") && item.endsWith("'"))
            ) {
              item = item.slice(1, -1);
            }
            return item;
          });
        }
        continue;
      }

      // Strip quotes
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }

      if (!isNaN(Number(val)) && val !== "") {
        data[key] = Number(val);
      } else if (val === "true") {
        data[key] = true;
      } else if (val === "false") {
        data[key] = false;
      } else {
        data[key] = val;
      }
    }
  }

  return { data, content };
}

/** Get all lessons sorted by track and order */
export function getAllLessons(): Lesson[] {
  if (!fs.existsSync(LESSONS_DIR)) {
    return [];
  }

  const entries = fs.readdirSync(LESSONS_DIR, { withFileTypes: true });
  const lessons: Lesson[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const slug = entry.name;
    const lessonPath = path.join(LESSONS_DIR, slug, "lesson.md");
    const quizPath = path.join(LESSONS_DIR, slug, "quiz.json");

    if (!fs.existsSync(lessonPath)) continue;

    const rawMd = fs.readFileSync(lessonPath, "utf-8");
    const { data, content } = parseFrontmatter(rawMd);

    let quiz: QuizQuestion[] = [];
    if (fs.existsSync(quizPath)) {
      try {
        quiz = JSON.parse(fs.readFileSync(quizPath, "utf-8"));
      } catch (err) {
        console.error(`Error parsing quiz for lesson ${slug}:`, err);
      }
    }

    // Calculate reading time (words / 200, rounded)
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.round(wordCount / 200));

    lessons.push({
      slug,
      title: data.title || slug,
      curriculumTitle: data.curriculumTitle || undefined,
      track: (data.track as "Python from zero" | "CS50P") || "Python from zero",
      module: data.module || "General",
      order: data.order || 99,
      level: (data.level as "Beginner" | "Intermediate" | "Advanced") || "Beginner",
      summary: data.summary || "",
      prerequisites: Array.isArray(data.prerequisites) ? data.prerequisites : [],
      learningGoals: Array.isArray(data.learningGoals) ? data.learningGoals : [],
      relatedProblems: Array.isArray(data.relatedProblems) ? data.relatedProblems : [],
      readingTime,
      content,
      quiz,
    });
  }

  // Sort by order ascending
  return lessons.sort((a, b) => a.order - b.order);
}

/** Group lessons by track, then by module */
export function getLessonsByTrackAndModule(): TrackWithModules[] {
  const all = getAllLessons();
  const trackNames: ("Python from zero" | "CS50P")[] = [
    "Python from zero",
    "CS50P",
  ];

  return trackNames.map((trackName) => {
    const trackLessons = all
      .filter((l) => l.track === trackName)
      .sort((a, b) => a.order - b.order);

    // Group by module preserving module order
    const moduleMap = new Map<string, Lesson[]>();
    for (const lesson of trackLessons) {
      const mod = lesson.module || "General";
      if (!moduleMap.has(mod)) {
        moduleMap.set(mod, []);
      }
      moduleMap.get(mod)!.push(lesson);
    }

    const modules: ModuleGroup[] = [];
    moduleMap.forEach((lessons, moduleName) => {
      modules.push({ moduleName, lessons });
    });

    return {
      trackName,
      modules,
    };
  });
}

/** Get a single lesson by slug, including previous and next links within its track */
export function getLessonBySlug(slug: string): {
  lesson: Lesson | null;
  previousLesson: AdjacentLesson | null;
  nextLesson: AdjacentLesson | null;
} {
  const all = getAllLessons();
  const lesson = all.find((l) => l.slug === slug) || null;

  if (!lesson) {
    return { lesson: null, previousLesson: null, nextLesson: null };
  }

  // Find siblings in the same track
  const trackLessons = all
    .filter((l) => l.track === lesson.track)
    .sort((a, b) => a.order - b.order);

  const currentIndex = trackLessons.findIndex((l) => l.slug === slug);
  const previous =
    currentIndex > 0
      ? {
          slug: trackLessons[currentIndex - 1].slug,
          title: trackLessons[currentIndex - 1].title,
        }
      : null;

  const next =
    currentIndex !== -1 && currentIndex < trackLessons.length - 1
      ? {
          slug: trackLessons[currentIndex + 1].slug,
          title: trackLessons[currentIndex + 1].title,
        }
      : null;

  return {
    lesson,
    previousLesson: previous,
    nextLesson: next,
  };
}

/** Get the full curriculum map parsed from CURRICULUM.md with matched written lessons and placeholders */
export function getCurriculum(): CurriculumTrack[] {
  const existingLessons = getAllLessons();
  if (!fs.existsSync(CURRICULUM_FILE)) {
    return [];
  }

  const raw = fs.readFileSync(CURRICULUM_FILE, "utf-8");
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const tracks: CurriculumTrack[] = [];
  let currentTrack: CurriculumTrack | null = null;
  let trackCounter = 0;

  for (const line of lines) {
    if (line.startsWith("Track:")) {
      const rest = line.slice("Track:".length).trim();
      const parenIdx = rest.indexOf("(");
      let trackNameRaw = "";
      if (parenIdx !== -1) {
        trackNameRaw = rest.slice(0, parenIdx).trim();
      } else {
        const colonIdx = rest.indexOf(":");
        trackNameRaw = colonIdx !== -1 ? rest.slice(0, colonIdx).trim() : rest.trim();
      }

      const trackName = trackNameRaw as "Python from zero" | "CS50P";
      trackCounter = 0;
      currentTrack = {
        trackName,
        readyCount: 0,
        totalCount: 0,
        modules: [],
      };
      tracks.push(currentTrack);

      // Check if lessons are listed directly on the Track line (e.g. CS50P)
      const afterParen = parenIdx !== -1 ? rest.slice(parenIdx) : rest;
      const colonAfter = afterParen.indexOf(":");
      if (colonAfter !== -1) {
        const lessonStr = afterParen.slice(colonAfter + 1).trim();
        if (lessonStr) {
          const titles = lessonStr
            .split(";")
            .map((s) => s.trim())
            .filter(Boolean);
          const moduleLessons: CurriculumLesson[] = [];
          for (const title of titles) {
            trackCounter++;
            const matched = existingLessons.find(
              (l) =>
                l.track === trackName &&
                (l.curriculumTitle === title || l.title === title)
            );
            if (matched) {
              currentTrack.readyCount++;
              moduleLessons.push({
                trackNumber: trackCounter,
                title: matched.title,
                isReady: true,
                slug: matched.slug,
                summary: matched.summary,
                level: matched.level,
                readingTime: matched.readingTime,
              });
            } else {
              moduleLessons.push({
                trackNumber: trackCounter,
                title,
                isReady: false,
              });
            }
          }
          currentTrack.totalCount += moduleLessons.length;
          currentTrack.modules.push({
            moduleName: "CS50P Weeks",
            lessons: moduleLessons,
          });
        }
      }
    } else if (line.startsWith("M") && line.includes(":")) {
      if (!currentTrack) continue;
      const colonIdx = line.indexOf(":");
      const moduleName = line.slice(0, colonIdx).trim();
      const lessonStr = line.slice(colonIdx + 1).trim();
      const titles = lessonStr
        .split(";")
        .map((s) => s.trim())
        .filter(Boolean);

      const moduleLessons: CurriculumLesson[] = [];
      for (const title of titles) {
        trackCounter++;
        const matched = existingLessons.find(
          (l) =>
            l.track === currentTrack!.trackName &&
            (l.curriculumTitle === title || l.title === title)
        );
        if (matched) {
          currentTrack.readyCount++;
          moduleLessons.push({
            trackNumber: trackCounter,
            title: matched.title,
            isReady: true,
            slug: matched.slug,
            summary: matched.summary,
            level: matched.level,
            readingTime: matched.readingTime,
          });
        } else {
          moduleLessons.push({
            trackNumber: trackCounter,
            title,
            isReady: false,
          });
        }
      }
      currentTrack.totalCount += moduleLessons.length;
      currentTrack.modules.push({
        moduleName,
        lessons: moduleLessons,
      });
    }
  }

  return tracks;
}
