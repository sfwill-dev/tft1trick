"use client";

import Image from "next/image";
import {
  Children,
  isValidElement,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type BoardTabProps = {
  id: string;
  title: string;
  image: string;
  alt?: string;
  width?: number;
  height?: number;
};

type BoardTabsProps = {
  boards?: BoardTabProps[];
  children?: ReactNode;
};

export function BoardTab() {
  return null;
}

function parseDimension(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
}

function extractBoardsFromChildren(children: ReactNode): BoardTabProps[] {
  return Children.toArray(children).flatMap((child) => {
    if (!isValidElement(child)) {
      return [];
    }

    const props = child.props as Partial<BoardTabProps>;
    if (
      typeof props.id !== "string" ||
      typeof props.title !== "string" ||
      typeof props.image !== "string"
    ) {
      return [];
    }

    return [
      {
        id: props.id,
        title: props.title,
        image: props.image,
        alt: typeof props.alt === "string" ? props.alt : undefined,
        width: parseDimension(props.width),
        height: parseDimension(props.height),
      },
    ];
  });
}

function getHashId(): string {
  if (globalThis.window === undefined) {
    return "";
  }

  return decodeURIComponent(globalThis.location.hash.replace(/^#/, ""));
}

export function BoardTabs({ boards = [], children }: Readonly<BoardTabsProps>) {
  const normalizedBoards = useMemo(() => {
    if (Array.isArray(boards) && boards.length > 0) {
      return boards;
    }

    return extractBoardsFromChildren(children);
  }, [boards, children]);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const hasSyncedInitialHashRef = useRef(false);

  const syncTabFromHash = useCallback(() => {
    const hashId = getHashId();
    if (!hashId) {
      return;
    }

    const boardIndex = normalizedBoards.findIndex((board) => board.id === hashId);
    if (boardIndex >= 0) {
      setActiveTabIndex(boardIndex);
    }
  }, [normalizedBoards]);

  useEffect(() => {
    if (normalizedBoards.length === 0 || hasSyncedInitialHashRef.current) {
      return;
    }

    hasSyncedInitialHashRef.current = true;
    const timeoutId = globalThis.setTimeout(syncTabFromHash, 0);

    return () => {
      globalThis.clearTimeout(timeoutId);
    };
  }, [normalizedBoards.length, syncTabFromHash]);

  useEffect(() => {
    globalThis.addEventListener("hashchange", syncTabFromHash);

    return () => {
      globalThis.removeEventListener("hashchange", syncTabFromHash);
    };
  }, [syncTabFromHash]);

  const safeActiveTabIndex = activeTabIndex >= normalizedBoards.length ? 0 : activeTabIndex;
  const activeBoard = normalizedBoards.at(safeActiveTabIndex) ?? null;
  const activePanelId = activeBoard ? `${activeBoard.id}-panel` : undefined;

  if (!activeBoard) {
    return null;
  }

  return (
    <section className="not-prose space-y-3 rounded-lg border border-zinc-800/80 py-3">
      <nav className="flex flex-wrap gap-2" aria-label="Board variations">
        {normalizedBoards.map((board, index) => {
          const isActive = activeBoard.id === board.id;
          const tabId = board.id;

          return (
            <button
              key={board.id}
              id={tabId}
              type="button"
              onClick={() => setActiveTabIndex(index)}
              aria-pressed={isActive}
              className={[
                "cursor-pointer rounded-md border px-3 py-1 text-sm font-medium transition-colors",
                isActive
                  ? "border-amber-300/80 bg-amber-400/20 text-amber-100"
                  : "border-zinc-700 bg-zinc-900 text-zinc-200 hover:border-zinc-500 hover:text-zinc-100",
              ].join(" ")}
            >
              {board.title}
            </button>
          );
        })}
      </nav>

      <div id={activePanelId}>
        <Image
          src={activeBoard.image}
          alt={activeBoard.alt ?? `${activeBoard.title} board`}
          width={activeBoard.width ?? 1200}
          height={activeBoard.height ?? 675}
          className="h-auto w-full rounded-md border border-zinc-700/80"
        />
      </div>
    </section>
  );
}
