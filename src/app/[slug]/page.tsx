import { Typography } from "@mui/material";
export async function generateStaticParams() {
  const url = "http://localhost:8081/nav";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    const qualification = json.find((item) =>
      item.title.includes("Qualifications")
    );
    return qualification.children.map((q) => ({
      slug: q.target,
    }));
  } catch (error) {
    console.log(error);
  }
}
const Qualification = ({ params: { slug } }) => {
  return (
    <Typography variant="h6" sx={{ p: 4 }}>
      {slug}'s Qualification
    </Typography>
  );
};

export default Qualification;
