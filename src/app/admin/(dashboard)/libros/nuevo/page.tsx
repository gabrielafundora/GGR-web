import { createBook } from "@/actions/books";
import { BookForm } from "../BookForm";

export default function NewBookPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl text-foreground">Nuevo libro</h1>
      <div className="mt-8">
        <BookForm action={createBook} />
      </div>
    </div>
  );
}
