"use client";
import { useEffect, useState } from "react";
import {
  Menu as MenuIcon,
  ArrowBack as ArrowBackIcon,
  Settings as SettingsIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Edit as EditIcon,
  Apps as AppsIcon,
} from "@mui/icons-material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import Button from "@mui/material/Button";
import Link from "next/link";
import { TextField } from "@mui/material";
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates,
  arrayMove,
} from "@dnd-kit/sortable";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

const SortableItem = (props) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id, disabled: props.disabled });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {props.children}
    </div>
  );
};
let data = [
  { id: 1, title: "Dashboard", target: "/" },
  {
    id: 2,
    title: "Job Applications",
    target: "/applications",
    children: [
      { id: 7, title: "John Doe", target: "/applications/john-doe" },
      { id: 10, title: "James Bond", target: "/applications/james-bond" },
      {
        id: 20,
        title: "Scarlett Johansson",
        target: "/applications/scarlett-johansson",
        visible: false,
      },
    ],
  },
  {
    id: 3,
    title: "Companies",
    target: "/companies",
    visible: false,
    children: [
      { id: 8, title: "Tanqeeb", target: "/companies/1" },
      { id: 9, title: "Daftra", target: "/companies/2" },
      { id: 11, title: "TBD", target: "/companies/14" },
    ],
  },
  {
    id: 4,
    title: "Qualifications",
    children: [
      { id: 14, title: "Q1", target: "/q1" },
      { id: 15, title: "Q2", target: "/q2" },
    ],
  },
  { id: 5, title: "About", target: "/about" },
  { id: 6, title: "Contact", target: "/contact" },
];
async function getNavItem() {
  const url = "http://localhost:8081/nav";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    data = json;
    return data;
  } catch (error) {
    return data;

    console.log(error);
  }
}

export default function Nav() {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [nameIndex, setNameIndex] = useState<number>(0);
  const [nameChange, setNameChange] = useState<string>("");
  const [openItem, setOpenItem] = useState<number>(0);
  const [navItems, setNavItems] = useState(data);
  const [dragMode, setDragMode] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = ({ active, over }) => {
    setDragMode(false);
    if (!over) {
      return;
    }
    const activeIndex = navItems.findIndex((item) => item.id === active.id);
    const overIndex = navItems.findIndex((item) => item.id === over.id);
    if (active.id == over.id) {
      return;
    }
    handleTrack(active.id, activeIndex, overIndex);
    setNavItems((items) => {
      return arrayMove(items, activeIndex, overIndex);
    });
  };
  function handleWindowSizeChange() {
    setWindowWidth(window.innerWidth);
  }
  const handleEnableNameEdit = (id: number) => {
    setNameIndex(id);
  };
  const handleDiscardNameChanges = () => {
    setNameIndex(0);
    setNameChange("");
  };
  const handleSaveNameChange = () => {
    const newNavItems = navItems.map((item) => {
      let newChildren;
      if (item.children) {
        newChildren = item.children.map((child) => {
          if (child.id === nameIndex) {
            const newChild = { ...child };
            newChild.title = nameChange;
            return newChild;
          } else {
            return child;
          }
        });
      }
      if (item.id === nameIndex) {
        const newItem = { ...item };
        newItem.title = nameChange;
        return newItem;
      } else {
        const newItem = { ...item };
        if (item.children) {
          newItem.children = newChildren;
        }
        return newItem;
      }
    });
    setNavItems(newNavItems);
    handleDiscardNameChanges();
  };
  const handleVisibilityChange = (id: number) => {
    const newNavItems = navItems.map((item) => {
      let newChildren;
      if (item.children) {
        newChildren = item.children.map((child) => {
          if (child.id === id) {
            const newChild = { ...child };
            newChild.visible = child.visible === false ? true : false;
            return newChild;
          } else {
            return child;
          }
        });
      }
      if (item.id === id) {
        const newItem = { ...item };
        newItem.visible = item.visible === false ? true : false;
        return newItem;
      } else {
        const newItem = { ...item };
        if (item.children) {
          newItem.children = newChildren;
        }
        return newItem;
      }
    });
    setNavItems(newNavItems);
  };
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
  const handleOpenEditMode = () => {
    setNameIndex(0);
    setNameChange("");
    setEditMode(true);
  };
  const handleExapnd = (id: number) => {
    if (openItem === id) {
      setOpenItem(0);
    } else setOpenItem(id);
  };
  const handleDiscardAllChanges = () => {
    handleFetchData();
    setEditMode(false);
    setNameIndex(0);
    setNameChange("");
  };
  async function handleFetchData() {
    const newNavItems = await getNavItem().then((res) => setNavItems(res));
  }
  async function handleTrack(id: string, from: number, to: number) {
    const url = "http://localhost:8081/track";
    const body = {
      id,
      from,
      to,
    };
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      if (!response.ok) {
        return data;
        throw new Error(`Response status: ${response.status}`);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function handleSaveChanges() {
    const url = "http://localhost:8081/nav";

    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(navItems),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
    } catch (error) {
      console.log(error);
    }
    setEditMode(false);
    setNameIndex(0);
    setNameChange("");
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);
  useEffect(() => {
    handleFetchData();
  }, []);
  const drawer = (
    <Box sx={{ px: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingInlineEnd: 0,
        }}
      >
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: "18px",
            px: 0,
            py: 2,
            color: "#404040",
          }}
        >
          <Button
            onClick={handleDrawerToggle}
            sx={{
              m: 0,
              p: 0,
              paddingInlineEnd: 0.5,
              minWidth: "0px",
            }}
          >
            <ArrowBackIcon
              sx={{
                fontSize: "18px",
                color: "#404040",
              }}
            />
          </Button>
          Menu
        </Typography>

        {editMode ? (
          <Box sx={{ marginInlineEnd: "10px" }}>
            <IconButton
              sx={{ paddingInline: 0.75 }}
              onClick={handleDiscardAllChanges}
            >
              <CancelIcon
                sx={{
                  fontSize: "32px",
                  color: "#ed1f03",
                }}
              />
            </IconButton>
            <IconButton
              sx={{ paddingInlineStart: 0 }}
              onClick={handleSaveChanges}
            >
              <CheckCircleIcon
                sx={{
                  fontSize: "32px",
                  color: "#3d8e41",
                }}
              />
            </IconButton>
          </Box>
        ) : (
          <Button onClick={handleOpenEditMode}>
            <SettingsIcon
              sx={{
                fontSize: "20px",
                color: "#404040",
              }}
            ></SettingsIcon>
          </Button>
        )}
      </Box>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext items={navItems} strategy={rectSortingStrategy}>
          <List sx={{ py: 0, width: "95%" }}>
            {navItems.map((item) => (
              <SortableItem key={item.id} id={item.id} disabled={!dragMode}>
                <ListItem
                  sx={{
                    backgroundColor: "#f7f7f7",
                    color: "#404040",
                    mb: 1,
                    flexDirection: "column",
                    alignItems: "flex-start",
                    width: "100%",
                    fontWeight: "18px",
                    display:
                      item.visible === false && !editMode ? "none" : "flex",
                    opacity: editMode && item.visible === false ? 0.5 : 1,
                  }}
                  key={item.id}
                  disablePadding
                >
                  {item.children ? (
                    <>
                      <ListItem
                        key={item.id}
                        sx={{
                          width: "100%",
                          display:
                            item.visible === false && !editMode
                              ? "none"
                              : "flex",
                          opacity: editMode && item.visible === false ? 0.5 : 1,
                        }}
                      >
                        {nameIndex === item.id && editMode ? (
                          <TextField
                            id="title-input"
                            variant="standard"
                            defaultValue={item.title}
                            sx={{ width: "100%" }}
                            onChange={(value) =>
                              setNameChange(value.target.value)
                            }
                          />
                        ) : (
                          <>
                            <AppsIcon
                              sx={{
                                display: editMode ? "inline-block" : "none",
                              }}
                              onMouseDown={() => setDragMode(true)}
                              onMouseUp={() => setDragMode(false)}
                            />
                            <ListItemText
                              primary={item.title}
                              sx={{ marginInlineStart: 1 }}
                            />
                          </>
                        )}
                        {editMode ? (
                          <Box sx={{ display: "flex" }}>
                            {nameIndex === item.id ? (
                              <>
                                <IconButton
                                  onClick={handleDiscardNameChanges}
                                  sx={{ px: 0 }}
                                >
                                  <CancelIcon />
                                </IconButton>
                                <IconButton
                                  onClick={handleSaveNameChange}
                                  sx={{ p: 0.5, paddingInlineEnd: 0 }}
                                >
                                  <CheckCircleIcon />
                                </IconButton>
                              </>
                            ) : (
                              <IconButton
                                onClick={() => handleEnableNameEdit(item.id)}
                              >
                                <EditIcon />
                              </IconButton>
                            )}
                            <IconButton
                              onClick={() => handleVisibilityChange(item.id)}
                            >
                              {item.visible === false ? (
                                <VisibilityOffIcon />
                              ) : (
                                <VisibilityIcon />
                              )}
                            </IconButton>
                          </Box>
                        ) : (
                          <IconButton onClick={() => handleExapnd(item.id)}>
                            {openItem === item.id ? (
                              <ExpandLess />
                            ) : (
                              <ExpandMore />
                            )}
                          </IconButton>
                        )}
                      </ListItem>
                      <Collapse
                        in={openItem === item.id}
                        timeout="auto"
                        unmountOnExit
                        sx={{ backgroundColor: "white", width: "100%" }}
                      >
                        <List disablePadding>
                          {item.children.map((child, index) => (
                            <ListItem
                              key={child.id}
                              sx={{
                                marginInlineStart: 2,
                                display:
                                  child.visible === false && !editMode
                                    ? "none"
                                    : "flex",
                                opacity:
                                  editMode && child.visible === false ? 0.5 : 1,
                              }}
                            >
                              {nameIndex === child.id && editMode ? (
                                <TextField
                                  id="title-input"
                                  variant="standard"
                                  defaultValue={child.title}
                                  sx={{ width: "100%" }}
                                  onChange={(value) =>
                                    setNameChange(value.target.value)
                                  }
                                />
                              ) : (
                                <Link
                                  href={child.target}
                                  key={item.id}
                                  aria-disabled="true"
                                  className="w-full"
                                  onClick={handleDrawerToggle}
                                  style={{
                                    pointerEvents: editMode ? "none" : "auto",
                                  }}
                                >
                                  <ListItemText primary={child.title} />
                                </Link>
                              )}

                              {editMode && (
                                <Box sx={{ display: "flex" }}>
                                  {nameIndex === child.id ? (
                                    <>
                                      <IconButton
                                        onClick={handleDiscardNameChanges}
                                        sx={{ px: 0 }}
                                      >
                                        <CancelIcon />
                                      </IconButton>
                                      <IconButton
                                        onClick={handleSaveNameChange}
                                        sx={{ p: 0.5, paddingInlineEnd: 0 }}
                                      >
                                        <CheckCircleIcon />
                                      </IconButton>
                                    </>
                                  ) : (
                                    <IconButton
                                      onClick={() =>
                                        handleEnableNameEdit(child.id)
                                      }
                                    >
                                      <EditIcon />
                                    </IconButton>
                                  )}
                                  <IconButton
                                    onClick={() =>
                                      handleVisibilityChange(child.id)
                                    }
                                  >
                                    {child.visible === false ? (
                                      <VisibilityOffIcon />
                                    ) : (
                                      <VisibilityIcon />
                                    )}
                                  </IconButton>
                                </Box>
                              )}
                            </ListItem>
                          ))}
                        </List>
                      </Collapse>
                    </>
                  ) : (
                    <ListItem sx={{ width: "100%" }}>
                      {nameIndex === item.id && editMode ? (
                        <TextField
                          id="title-input"
                          variant="standard"
                          defaultValue={item.title}
                          sx={{ width: "100%" }}
                          onChange={(value) =>
                            setNameChange(value.target.value)
                          }
                        />
                      ) : (
                        <>
                          <AppsIcon
                            sx={{
                              display: editMode ? "inline-block" : "none",
                            }}
                            onMouseDown={() => setDragMode(true)}
                            onMouseUp={() => setDragMode(false)}
                          />
                          <Link
                            href={item.target}
                            key={item.id}
                            aria-disabled="true"
                            className="w-full"
                            onClick={handleDrawerToggle}
                            style={{
                              pointerEvents: editMode ? "none" : "auto",
                            }}
                          >
                            <ListItemText
                              primary={item.title}
                              sx={{ marginInlineStart: 1 }}
                            />
                          </Link>
                        </>
                      )}

                      {editMode ? (
                        <Box sx={{ display: "flex" }}>
                          {nameIndex === item.id ? (
                            <>
                              <IconButton
                                onClick={handleDiscardNameChanges}
                                sx={{ px: 0 }}
                              >
                                <CancelIcon />
                              </IconButton>
                              <IconButton
                                onClick={handleSaveNameChange}
                                sx={{ p: 0.5, paddingInlineEnd: 0 }}
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            </>
                          ) : (
                            <IconButton
                              onClick={() => handleEnableNameEdit(item.id)}
                            >
                              <EditIcon />
                            </IconButton>
                          )}
                          <IconButton
                            onClick={() => handleVisibilityChange(item.id)}
                          >
                            {item.visible === false ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </Box>
                      ) : (
                        <IconButton onClick={() => handleExapnd(item.id)}>
                          {openItem === item.id ? (
                            <ExpandLess />
                          ) : (
                            <ExpandMore />
                          )}
                        </IconButton>
                      )}
                    </ListItem>
                  )}
                </ListItem>
              </SortableItem>
            ))}
          </List>
        </SortableContext>
      </DndContext>
    </Box>
  );
  return (
    <Box
      sx={{
        display: "flex",
        height: windowWidth > 900 ? "100%" : "auto",
        width: windowWidth > 900 ? "300px" : "75px",
        order: windowWidth > 900 ? "-1" : "2",
        backgroundColor: "white",
      }}
    >
      <CssBaseline />
      {windowWidth > 900 ? (
        <AppBar
          sx={{
            backgroundColor: "white",
            "&.MuiAppBar-root": {
              position: windowWidth > 900 ? "unset" : "fixed",
              height: "100%",
              boxShadow: "none",
            },
          }}
        >
          <Box sx={{ pb: 2 }}>
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "18px",
                px: 3.25,
                py: 2,
                color: "#404040",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingInlineEnd: 0,
              }}
            >
              Menu
              {editMode ? (
                <Box sx={{ marginInlineEnd: "10px" }}>
                  <IconButton
                    sx={{ padding: 0 }}
                    onClick={handleDiscardAllChanges}
                  >
                    <CancelIcon
                      sx={{
                        fontSize: "32px",
                        color: "#ed1f03",
                      }}
                    />
                  </IconButton>
                  <IconButton sx={{ padding: 0 }} onClick={handleSaveChanges}>
                    <CheckCircleIcon
                      sx={{
                        fontSize: "32px",
                        color: "#3d8e41",
                      }}
                    />
                  </IconButton>
                </Box>
              ) : (
                <Button onClick={handleOpenEditMode}>
                  <SettingsIcon
                    sx={{
                      fontSize: "20px",
                      color: "#404040",
                    }}
                  ></SettingsIcon>
                </Button>
              )}
            </Typography>
            <Divider sx={{ width: "100%" }} />
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
              <SortableContext items={navItems} strategy={rectSortingStrategy}>
                <List sx={{ px: 2 }}>
                  {navItems.map((item) => (
                    <SortableItem
                      key={item.id}
                      id={item.id}
                      disabled={!dragMode}
                    >
                      <ListItem
                        sx={{
                          backgroundColor: "#f7f7f7",
                          color: "#404040",
                          mb: 1,
                          dispay: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          width: "100%",
                          fontSize: "18px",
                          display:
                            item.visible === false && !editMode
                              ? "none"
                              : "flex",
                          opacity: editMode && item.visible === false ? 0.5 : 1,
                        }}
                        disablePadding
                      >
                        {item.children ? (
                          <>
                            <ListItem
                              key={item.id}
                              sx={{
                                width: "100%",
                                display:
                                  item.visible === false && !editMode
                                    ? "none"
                                    : "flex",
                                opacity:
                                  editMode && item.visible === false ? 0.5 : 1,
                              }}
                            >
                              {nameIndex === item.id && editMode ? (
                                <TextField
                                  id="title-input"
                                  variant="standard"
                                  defaultValue={item.title}
                                  sx={{ width: "100%" }}
                                  onChange={(value) =>
                                    setNameChange(value.target.value)
                                  }
                                />
                              ) : (
                                <>
                                  <AppsIcon
                                    sx={{
                                      display: editMode
                                        ? "inline-block"
                                        : "none",
                                    }}
                                    onMouseDown={() => setDragMode(true)}
                                    onMouseUp={() => setDragMode(false)}
                                  />
                                  <ListItemText
                                    primary={item.title}
                                    sx={{ marginInlineStart: 1 }}
                                  />
                                </>
                              )}
                              {editMode ? (
                                <Box sx={{ display: "flex" }}>
                                  {nameIndex === item.id ? (
                                    <>
                                      <IconButton
                                        onClick={handleDiscardNameChanges}
                                        sx={{ px: 0 }}
                                      >
                                        <CancelIcon />
                                      </IconButton>
                                      <IconButton
                                        onClick={handleSaveNameChange}
                                        sx={{ p: 0.5, paddingInlineEnd: 0 }}
                                      >
                                        <CheckCircleIcon />
                                      </IconButton>
                                    </>
                                  ) : (
                                    <IconButton
                                      onClick={() =>
                                        handleEnableNameEdit(item.id)
                                      }
                                    >
                                      <EditIcon />
                                    </IconButton>
                                  )}
                                  <IconButton
                                    onClick={() =>
                                      handleVisibilityChange(item.id)
                                    }
                                  >
                                    {item.visible === false ? (
                                      <VisibilityOffIcon />
                                    ) : (
                                      <VisibilityIcon />
                                    )}
                                  </IconButton>
                                </Box>
                              ) : (
                                <IconButton
                                  onClick={() => handleExapnd(item.id)}
                                >
                                  {openItem === item.id ? (
                                    <ExpandLess />
                                  ) : (
                                    <ExpandMore />
                                  )}
                                </IconButton>
                              )}
                            </ListItem>
                            <Collapse
                              in={openItem === item.id}
                              timeout="auto"
                              unmountOnExit
                              sx={{ backgroundColor: "white", width: "100%" }}
                            >
                              <List disablePadding>
                                {item.children.map((child) => (
                                  <ListItem
                                    key={child.id}
                                    sx={{
                                      marginInlineStart: 2,
                                      display:
                                        child.visible === false && !editMode
                                          ? "none"
                                          : "flex",
                                      opacity:
                                        editMode && child.visible === false
                                          ? 0.5
                                          : 1,
                                    }}
                                  >
                                    {nameIndex === child.id && editMode ? (
                                      <TextField
                                        id="title-input"
                                        variant="standard"
                                        defaultValue={child.title}
                                        sx={{ width: "100%" }}
                                        onChange={(value) =>
                                          setNameChange(value.target.value)
                                        }
                                      />
                                    ) : (
                                      <Link
                                        href={child.target}
                                        key={item.id}
                                        aria-disabled="true"
                                        className="w-full"
                                        onClick={handleDrawerToggle}
                                        style={{
                                          pointerEvents: editMode
                                            ? "none"
                                            : "auto",
                                        }}
                                      >
                                        <ListItemText primary={child.title} />
                                      </Link>
                                    )}

                                    {editMode && (
                                      <Box sx={{ display: "flex" }}>
                                        {nameIndex === child.id ? (
                                          <>
                                            <IconButton
                                              onClick={handleDiscardNameChanges}
                                              sx={{ px: 0 }}
                                            >
                                              <CancelIcon />
                                            </IconButton>
                                            <IconButton
                                              onClick={handleSaveNameChange}
                                              sx={{
                                                p: 0.5,
                                                paddingInlineEnd: 0,
                                              }}
                                            >
                                              <CheckCircleIcon />
                                            </IconButton>
                                          </>
                                        ) : (
                                          <IconButton
                                            onClick={() =>
                                              handleEnableNameEdit(child.id)
                                            }
                                          >
                                            <EditIcon />
                                          </IconButton>
                                        )}
                                        <IconButton
                                          onClick={() =>
                                            handleVisibilityChange(child.id)
                                          }
                                        >
                                          {child.visible === false ? (
                                            <VisibilityOffIcon />
                                          ) : (
                                            <VisibilityIcon />
                                          )}
                                        </IconButton>
                                      </Box>
                                    )}
                                  </ListItem>
                                ))}
                              </List>
                            </Collapse>
                          </>
                        ) : (
                          <ListItem
                            sx={{
                              display:
                                item.visible === false && !editMode
                                  ? "none"
                                  : "flex",
                              opacity:
                                editMode && item.visible === false ? 0.5 : 1,
                            }}
                          >
                            {nameIndex === item.id && editMode ? (
                              <TextField
                                id="title-input"
                                variant="standard"
                                defaultValue={item.title}
                                sx={{ width: "100%" }}
                                onChange={(value) =>
                                  setNameChange(value.target.value)
                                }
                              />
                            ) : (
                              <>
                                {" "}
                                <AppsIcon
                                  sx={{
                                    display: editMode ? "inline-block" : "none",
                                  }}
                                  onMouseDown={() => setDragMode(true)}
                                  onMouseUp={() => setDragMode(false)}
                                />
                                <Link
                                  href={item.target}
                                  key={item.id}
                                  aria-disabled="true"
                                  className="w-full"
                                  style={{
                                    pointerEvents: editMode ? "none" : "auto",
                                  }}
                                >
                                  <ListItemText
                                    primary={item.title}
                                    sx={{ marginInlineStart: 1 }}
                                  />
                                </Link>
                              </>
                            )}
                            {editMode ? (
                              <Box sx={{ display: "flex" }}>
                                {nameIndex === item.id ? (
                                  <>
                                    <IconButton
                                      onClick={handleDiscardNameChanges}
                                      sx={{ px: 0 }}
                                    >
                                      <CancelIcon />
                                    </IconButton>
                                    <IconButton
                                      onClick={handleSaveNameChange}
                                      sx={{ p: 0.5, paddingInlineEnd: 0 }}
                                    >
                                      <CheckCircleIcon />
                                    </IconButton>
                                  </>
                                ) : (
                                  <IconButton
                                    onClick={() =>
                                      handleEnableNameEdit(item.id)
                                    }
                                  >
                                    <EditIcon />
                                  </IconButton>
                                )}
                                <IconButton
                                  onClick={() =>
                                    handleVisibilityChange(item.id)
                                  }
                                >
                                  {item.visible === false ? (
                                    <VisibilityOffIcon />
                                  ) : (
                                    <VisibilityIcon />
                                  )}
                                </IconButton>
                              </Box>
                            ) : (
                              ""
                            )}
                          </ListItem>
                        )}
                      </ListItem>
                    </SortableItem>
                  ))}
                </List>
              </SortableContext>
            </DndContext>
          </Box>
        </AppBar>
      ) : (
        <Button
          onClick={handleDrawerToggle}
          sx={{
            backgroundColor: "white",
            height: "48px",
            width: "48px",
            borderRadius: "1",
            color: " #404040",
            border: "1px solid #f0f0f0",
            mt: 2,
            minWidth: "48px",
          }}
        >
          <MenuIcon />
        </Button>
      )}

      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: "95%",
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
      </Box>
    </Box>
  );
}
