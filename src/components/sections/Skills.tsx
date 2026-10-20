// 1) The category titles, in the order they appear on the page.
//    To add a new box, add a title here (e.g. "Cloud").
//    `as const` lets TypeScript remember these exact words, so it can catch typos below.
const categories = ["Languages", "Frameworks", "AI/ML", "Tools"] as const;

// A Category is one of the words in the list above, and nothing else
type Category = (typeof categories)[number];

// 2) Every skill, tagged with the category it belongs to.
//    To add a skill, add one line. Order here = order inside its box.
// TODO: replace these with your real skills
const skills: { name: string; category: Category }[] = [
  { name: "Python", category: "Languages" },
  { name: "TypeScript", category: "Languages" },
  { name: "Java", category: "Languages" },
  { name: "C++", category: "Languages"},
  { name: "React", category: "Frameworks" },
  { name: "Next.js", category: "Frameworks" },
  { name: "Tailwind CSS", category: "Frameworks" },
  { name: "PyTorch", category: "AI/ML" },
  { name: "LangChain", category: "AI/ML" },
  { name: "scikit-learn", category: "AI/ML" },
  { name: "Git", category: "Tools" },
  { name: "Docker", category: "Tools" },
];

const skillsy : {category: Category, names: string[]}[] = [
  {category : "Languages", names : ["Python", "TypeScript", "JavaScript", "Java", "Kotlin", "C", "C++", "SQL"]},
  {category: "Frameworks", names: ["React", "Next.js", "Tailwindcss", "Django", "Flask", "Express.js"]},
  {category: "AI/ML", names: ["PyTorch", "pandas", "scikit-learn", "Langchain", "LangGraph", "NumPy"]},
  {category: "Tools", names: ["Git/GitHub", "Docker", "Kubernetes", "Gherkin", "OpenAPI", "AWS"]}
]

export default function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-5xl px-6 py-32">
      <h2 className="text-4xl font-bold">Skills</h2>

      {/* One box per category: 1 column on phones, 2 on tablets, 4 on desktop */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <div key={category} className="rounded-2xl border border-black/10 p-6">
            <h3 className="text-lg font-bold">{category}</h3>

            <ul className="mt-4 flex flex-wrap gap-2">
              {/* Keep only the skills whose category matches this box */}
              {
                skillsy.filter((group) => group.category === category)
                .flatMap((group) => group.names.map((name)=> (
                      <li key={name} className="rounded-full border border-black/10 px-3 py-1 text-sm transition duration-300 ease-in-out hover:bg-blue-700 hover:text-gray-100">
                    {name}
                  </li>
                )))}

            </ul>
          </div>
        ))}
      </div>

      {/* TODO: make the boxes fade up as you scroll (copy the .reveal pattern from About.tsx) */}
    </section>
  );
}
