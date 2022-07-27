import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { trpc } from "../utils/trpc";

type TechnologyCardProps = {
  name: string;
  description: string;
  documentation: string;
};

const Home: NextPage = () => {
  const [value, setValue] = useState("");
  const todoGet = trpc.useMutation(["todo.create-todo"])

  const getListTodo = trpc.useQuery(["todo.get-list-todo", { name: undefined }], { enabled: false })

  const handleClick = () => {
    todoGet.mutate({ name: value }, {
      onSuccess: (data) => {
        alert("Create success");
      }
    });
  };

  const handleClick2 = () => {
    getListTodo.refetch();
  }
  return (
    <>
      {todoGet.isLoading && "loading..."}
      <input value={value} onChange={(event) => setValue(event.target.value)} />
      <button onClick={handleClick2} type="button">check</button>
      {JSON.stringify(getListTodo.data)}
    </>
  );
};

const TechnologyCard = ({
  name,
  description,
  documentation,
}: TechnologyCardProps) => {
  return (
    <section className="flex flex-col justify-center p-6 duration-500 border-2 border-gray-500 rounded shadow-xl motion-safe:hover:scale-105">
      <h2 className="text-lg text-gray-700">{name}</h2>
      <p className="text-sm text-gray-600">{description}</p>
      <a
        className="mt-3 text-sm underline text-violet-500 decoration-dotted underline-offset-2"
        href={documentation}
        target="_blank"
        rel="noreferrer"
      >
        Documentation
      </a>
    </section>
  );
};

export default Home;
