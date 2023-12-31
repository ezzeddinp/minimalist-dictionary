"use client";
import { FormEvent, useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import WordResultsView from "@/components/home/WordResultsView";
import useWordResultsQuery from "@/useCases/useWordResultsQuery";
import useDebounce from "@/utils/hooks/useDebounce";
import WordNotFoundView from "@/components/home/WordNotFoundView";
import WordLoadingView from "@/components/home/WordLoadingView";
import { useRouter, useSearchParams } from "next/navigation";
import createQueryString from "@/utils/createQueryString";

export const metadata = {
  title: "ezzeddin | Dictionary app challenge",
};

const SEARCH_DEBOUNCE_VALUE_IN_MS = 500;
const DEFAULT_SEARCH_WORD = "keyboard";

export default function HomeContainer() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const searchWordFromParams = searchParams.get("word");

  const [searchWord, setSearchWord] = useState<string>(
    searchWordFromParams ?? DEFAULT_SEARCH_WORD
  );
  const debouncedSearchWord = useDebounce<string>(
    searchWord,
    SEARCH_DEBOUNCE_VALUE_IN_MS
  );

  const { data, isLoading, isError, isSuccess } =
    useWordResultsQuery(debouncedSearchWord);

  function handleSubmitForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  useEffect(() => {
    router.replace(`?${createQueryString("word", debouncedSearchWord)}`);
  }, [debouncedSearchWord, router]);

  return (
    <main
      className={`w-full flex min-h-screen max-w-[735px] mx-auto flex-col p-8 md:p-24 gap-8 md:gap-16`}
    >
      <form className="w-full" id="search-form" onSubmit={handleSubmitForm}>
        <SearchBar
          id="search-bar"
          defaultValue={searchWordFromParams ?? undefined}
          onSearch={setSearchWord}
          placeholder="word"
        />
      </form>

      <output htmlFor="search-bar" form="search-form">
        {isLoading && <WordLoadingView />}
        {isError && <WordNotFoundView searchWord={searchWord} />}
        {isSuccess && <WordResultsView data={data} />}
      </output>
    </main>
  );
}
