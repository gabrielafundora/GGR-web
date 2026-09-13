import { createArticle } from "@/actions/articles";
import { ArticleForm } from "../ArticleForm";

export default function NewArticlePage() {
  return (
    <div>
      <h1 className="font-serif text-3xl text-foreground">Nuevo artículo</h1>
      <div className="mt-8">
        <ArticleForm action={createArticle} />
      </div>
    </div>
  );
}
