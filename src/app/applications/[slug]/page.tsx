import { Typography } from "@mui/material";
export async function generateStaticParams() {
  const url = "http://localhost:8081/nav";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    const applications = json.find((item) =>
      item.target.includes("applications")
    );
    return applications.children.map((application) => ({
      slug: application.target,
    }));
  } catch (error) {
    console.log(error);
  }
}
const Applications = ({ params: { slug } }) => {
  return (
    <Typography variant="h6" sx={{ p: 4 }}>
      {slug}'s Application
    </Typography>
  );
};

export default Applications;
