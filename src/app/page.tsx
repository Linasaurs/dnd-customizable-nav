import { Box, List, Switch, Typography, ListItem } from "@mui/material";

export default function Home() {
  return (
    <Box sx={{ p: 2, width: "100%", textAlign: "justify", fontSize: "14px" }}>
      <Box
        sx={{
          p: 1,
          backgroundColor: "#3d8e41",
          borderRadius: 1,
          color: "white",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          height: "48px",
          "@media (min-width: 900px)": {
            height: "unset",
            p: 2,
          },
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 600,
              "@media (min-width: 900px)": {
                fontSize: "14px",
              },
            }}
          >
            UI Designer in Egypt
          </Typography>
          <Typography
            sx={{
              fontSize: "10px",
              fontWeight: 300,
              "@media (min-width: 900px)": {
                fontSize: "12px",
              },
            }}
          >
            70 job positions
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            "@media (max-width: 900px)": {
              mb: "-7px",
              mt: "auto",
            },
          }}
        >
          <Typography
            sx={{
              fontWeight: 300,
              fontSize: "8px",
              "@media (min-width: 900px)": {
                fontSize: "12px",
              },
            }}
          >
            Set Alerts
          </Typography>
          <Switch
            size="small"
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: "#f3fdf3",
              },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#f3fdf3",
              },
            }}
          />
        </Box>
      </Box>
      <Box sx={{ py: 4 }}>
        <Typography variant="h6" sx={{ py: 0.5, fontSize: "16px" }}>
          Read Me
        </Typography>
        <Typography variant="body">
          This project was developed with NextJs, and while there is a fail-safe
          feature implemented in case of server errors, to be able to use all
          the features please make sure to run the local server provided on port
          8081
        </Typography>
        <Typography
          variant="h6"
          sx={{ py: 0.5, paddingBlockStart: 3, fontSize: "16px" }}
        >
          Features
        </Typography>
        <List>
          <ListItem>
            Sortable and draggable items for top-level navigation items
          </ListItem>
          <ListItem>Reusable layout for pages</ListItem>
          <ListItem>Dynamic Routing</ListItem>
          <ListItem>
            Cutomizable Navigation on both desktop and mobile [Item Visibility,
            Order, & Name]
          </ListItem>
          <ListItem>
            Lock Safe not to accidentally sort items while editing other
            features
          </ListItem>
          <ListItem>
            Lock Safe not to edit items while navigating, or navigate while
            editing
          </ListItem>
        </List>
        <Typography
          variant="h6"
          sx={{ py: 0.5, paddingBlockStart: 1.5, fontSize: "16px" }}
        >
          Improvements
        </Typography>
        <Typography variant="body">
          I pioritized implementing as much features and functionality as I can
          in the project. And while not all components are pixel-perfect, I did
          try to implement a few that adhere strictly to the design. I am aware
          that a lot of improvements can be made for the code structure, overall
          functionality, reusability, and design. But my stratedgy was to
          utilize as much features to showcase a differents skills rather than
          focusing on one. And to be able to overall deliver as much as possible
          within the time frame.
        </Typography>
      </Box>
    </Box>
  );
}
