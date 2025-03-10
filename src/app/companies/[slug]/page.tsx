import { Typography } from "@mui/material";

export async function generateStaticParams() {
  const url = "http://localhost:8081/nav";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    const companies = json.find((item) => item.target.includes("companies"));
    return companies.children.map((company) => ({
      slug: company.target,
    }));
  } catch (error) {
    console.log(error);
  }
}
const Companies = ({ params: { slug } }) => {
  return (
    <Typography variant="h6" sx={{ p: 4 }}>
      {slug}'s Company
    </Typography>
  );
};

export default Companies;
