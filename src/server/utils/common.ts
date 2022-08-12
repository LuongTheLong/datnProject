const slugGenerator = (title: string) => {
  return title;
};

type NameGeneratorParams = {
  name: string;
  age: number;
};

const nameGenerator = ({ name, age }: NameGeneratorParams) => {};

export { slugGenerator, nameGenerator };
