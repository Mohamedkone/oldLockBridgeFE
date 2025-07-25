import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import { AuthContext } from "context/AuthContext";
import ModalClose1Btn from "ui-component/modals/ModalClose1Btn";
import ModalClose2Btn from "ui-component/modals/ModalClose2Btn";
import {
  Breadcrumbs,
  ActionButtons,
  NewFolderForm,
  FileGrid,
  ContextMenu,
  MoveModal
} from "./components";
import Loading from "views/pages/Loading";

const getItemsByParentId = (parentId, structure) => {
  return Object.values(structure).filter((item) => item.parentId === parentId);
};

const FinderApp = () => {
  const [currentParentId, setCurrentParentId] = useState("root");
  const [breadcrumbs, setBreadcrumbs] = useState([{ id: "root", name: "Root" }]);
  const [contextMenu, setContextMenu] = useState(null);
  const [mOpen, setMOpen] = useState(false);
  const [dModal, setDModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [fileSystemState, setFileSystemState] = useState({});
  const [newNameError, setNewNameError] = useState(false);
  const [currentItems, setCurrentItems] = useState([]);
  const { api, myInfo } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const [loadingStatus, setLoadingStatus] = useState(true)
  const [moveModalOpen, setMoveModalOpen] = useState(false);

  // Initial data fetch
  useEffect(() => {
    if (!myInfo) return;
    axios.get(`${api}/vdata/${myInfo.id}`)
      .then((res) => {
        setFileSystemState(res.data)
        setLoadingStatus(false)
        console.log(res.data)
    })
      .catch(console.error);
    
  }, [api, myInfo]);




  // Breadcrumb handling
  useLayoutEffect(() => {
    const breadcrumbParam = searchParams.get("c");
    if (breadcrumbParam) {
      const decodedBreadcrumbs = JSON.parse(decodeURIComponent(breadcrumbParam));
      setBreadcrumbs(decodedBreadcrumbs);
      setCurrentParentId(decodedBreadcrumbs[decodedBreadcrumbs.length - 1]?.id || "root");
    }
  }, [searchParams]);

  useEffect(() => { 
    const encodedBreadcrumbs = encodeURIComponent(JSON.stringify(breadcrumbs));
    window.history.replaceState(null, "", `?c=${encodedBreadcrumbs}`);
  }, [breadcrumbs]);

  useEffect(() => {
    setCurrentItems(getItemsByParentId(currentParentId, fileSystemState));
  }, [fileSystemState, currentParentId]);

  // Navigation handlers
  const handleFolderClick = (folder) => {
    setCurrentParentId(folder.id);
    setBreadcrumbs((prev) => [...prev, { id: folder.id, name: folder.name }]);
  };

  const handleGoBack = (index) => {
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(newBreadcrumbs);
    setCurrentParentId(newBreadcrumbs[newBreadcrumbs.length - 1].id);
  };

  const handlePrevious = () => {
    if (breadcrumbs.length > 1) {
      const newBreadcrumbs = breadcrumbs.slice(0, -1);
      setBreadcrumbs(newBreadcrumbs);
      setCurrentParentId(newBreadcrumbs[newBreadcrumbs.length - 1].id);
    }
  };

  // Context menu handlers
  const handleRightClick = (event, item) => {
    event.preventDefault();
    setSelectedItem(item);
    setContextMenu({ top: event.clientY, left: event.clientX });
  };

  const handleCloseContextMenu = () => setContextMenu(null);

  // Folder operations
  const handleNewFolderClick = () => {
    setIsCreatingFolder(true);
    setNewFolderName("");
  };

  const handleFolderNameChange = (event) => setNewFolderName(event.target.value);

  const handleCreateFolder = async () => {
    if (newFolderName.trim() === "") return;
    
    const folderNames = currentItems
      .filter(item => item.type === 'folder')
      .map(item => item.name);

    if (folderNames.includes(newFolderName)) {
      setNewNameError(true);
      return;
    }

    try {
      const newFolder = {
        id: Date.now().toString(),
        ownerId: myInfo.id,
        name: newFolderName,
        size: 0,
        type: 'folder',
        parentId: currentParentId,
      };

      await axios.post(`${api}/vdata`, newFolder).then(res=>{
        console.log(res)
        setFileSystemState(prev => ({ ...prev, [res.data.id]: res.data }));
        setIsCreatingFolder(false);
        setNewFolderName("");
        setNewNameError(false);
      });
    } catch (error) {
      console.error("Folder creation failed:", error);
    }
  };

  const handleCancelCreation = () => {
    setIsCreatingFolder(false);
    setNewFolderName("");
    setNewNameError(false);
  };

  // Add this method for handling the move
const handleMoveItem = async (newParentId) => {
  if (!selectedItem || !newParentId) return;

  try {
    // Update server
    await axios.put(`${api}/vdata/${selectedItem.id}/move`, {
      newParentId
    }).then((res)=>{
      if(res.status===200) window.location.reload()
    });

    // Update local state
    setFileSystemState(prev => ({
      ...prev,
      [selectedItem.id]: {
        ...prev[selectedItem.id],
        parentId: newParentId
      }
    }));

    // If moving the current folder, update breadcrumbs
    if (selectedItem.id === currentParentId) {
      const newBreadcrumbs = breadcrumbs.slice(0, -1);
      setBreadcrumbs(newBreadcrumbs);
      setCurrentParentId(newParentId);
    }

    setSelectedItem(null);
  } catch (error) {
    console.error("Move failed:", error);
    // Handle error (show notification to user)
  }
};

  // Delete operations
  const handleOpenDModal = () => {
    handleCloseContextMenu();
    setDModal(true);
  };

  const handleCloseDModal = () => {
    setSelectedItem(null);
    setDModal(false);
  };

  const handleDelete = () => {
    if (!selectedItem) return;
    
    const hasChildren = getItemsByParentId(selectedItem.id, fileSystemState).length > 0;
    if (hasChildren) {
      setMOpen(true);
      return handleCloseDModal();
    }

    axios.delete(`${api}/vdata/${selectedItem.id}`)
      .then(() => {
        window.location.reload()
        handleCloseDModal();

      })
      .catch(console.error);
  };

  const displayedBreadcrumbs = breadcrumbs.length >= 5
    ? [breadcrumbs[0], { id: "ellipsis", name: "..." }, ...breadcrumbs.slice(-2)]
    : breadcrumbs;

  return (
    <Box sx={{ padding: 2 }} display="flex" flexDirection="column" gap={2}>
      <Typography textAlign={'center'}>
        **To upload to this vault create a livebridge and connect it to your vault
      </Typography>
      <Breadcrumbs
        displayedBreadcrumbs={displayedBreadcrumbs}
        breadcrumbs={breadcrumbs}
        handleGoBack={handleGoBack}
      />

      <ActionButtons
        handlePrevious={handlePrevious}
        handleNewFolderClick={handleNewFolderClick}
        isPreviousDisabled={currentParentId === "root"}
      />

      {isCreatingFolder && (
        <NewFolderForm
          newFolderName={newFolderName}
          handleFolderNameChange={handleFolderNameChange}
          handleCreateFolder={handleCreateFolder}
          handleCancelCreation={handleCancelCreation}
          newNameError={newNameError}
        />
      )}

      {
      !loadingStatus?<FileGrid
        currentItems={currentItems}
        handleFolderClick={handleFolderClick}
        handleRightClick={handleRightClick}
      />
      :
      <Box display={'flex'} justifyContent={'center'}>
        <Loading />
      </Box>
      }

      <ContextMenu
        contextMenu={contextMenu}
        handleClose={handleCloseContextMenu}
        handleDelete={handleOpenDModal}
        handleMove={() => setMoveModalOpen(true)}
      />
      
      <MoveModal
        open={moveModalOpen}
        onClose={() => setMoveModalOpen(false)}
        fileSystem={fileSystemState}
        currentItem={selectedItem}
        onMove={handleMoveItem}
      />

      <ModalClose1Btn
        open={mOpen}
        handleAction={() => setMOpen(false)}
        title="Warning"
        content="Folder must be empty to delete."
        btn="Close"
        contentType="text"
      />

      <ModalClose2Btn
        open={dModal}
        btn1="Cancel"
        btn1Func={handleCloseDModal}
        btn2="Delete"
        btn2Func={handleDelete}
        title="Confirm Delete"
        content="Are you sure you want to delete this item? This action cannot be undone."
        contentType="text"
      />
    </Box>
  );
};

export default FinderApp;