import Image from "next/image";
import { db } from './firebase'
import { collection,  getDocs, QueryDocumentSnapshot } from "firebase/firestore"; 
import { News } from "./types/news";
import Search from "./ui/search";

const converter = {
  toFirestore: (data: News) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) =>
    ({ ...snap.data(), id:snap.id}) as News
}

const getFilteredArticles = (news: News[], searchString: string): News[] => 
  news.filter(({ headline}) => headline.toLowerCase().includes(searchString.toLowerCase()))



export default async function Home(props: {
  searchParams?: Promise<{
    query?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const newsArticles = await getDocs(collection(db, "news").withConverter(converter));
  if (newsArticles.empty) {
    return;
  }
  const data = newsArticles.docs.map(doc => doc.data())
  const filteredNews = getFilteredArticles(data, query)
  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <article className="prose lg:prose-xl ">
      <h1> News</h1>
      <Search placeholder="Search Article"/>

      {filteredNews.length ? filteredNews.map(article => 
        <ul key={article.id}>
          <h2> {article.headline}</h2>
            <img
              src={article.thumbnail}
              width={180}
              height={38}
          />
          <a href={article.link} target="_blank">{article.link}</a>
          </ul>
      ): <p>No articles were found</p>}
      </article>

    </div>
  );
}
