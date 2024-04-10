import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Input,
  Flex,
  Spinner,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Image,
  useToast,
} from "@chakra-ui/react";
import { BeatLoader } from "react-spinners";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchGameListData,
  selectGameListData,
  selectGameListLoading,
  selectGameListError,
  AddGameListData,
  deleteGameListData,
  updateGameListData,
} from "../../../app/Slices/GameListSlice";

export default function GameGameList() {
  const [isAddGameListModalOpen, setIsAddGameListModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newGameListData, setNewGameListData] = useState({
    game_title: "",
    game_thumbnail: "",
    game_background_image: "",
    game_starting_price: "",
    game_status: "",
    game_duration_seconds: "",
    game_freeze_seconds: "",
    game_category_id: "",
    game_secondary_background_image: "",
    game_max_price: "",
    game_not_played: "",
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [GameListToDelete, setGameListToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedGameListData, setEditedGameListData] = useState(null);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  const GameListData = useSelector(selectGameListData);
  const isLoading = useSelector(selectGameListLoading);
  const error = useSelector(selectGameListError);
  const dispatch = useDispatch();
  const Toast = useToast();

  useEffect(() => {
    dispatch(fetchGameListData());
  }, [dispatch]);

  const handleAddGameList = (e) => {
    e.preventDefault();

    setIsSaveLoading(true);

    const formData = new FormData();
    formData.append("game_title", newGameListData.game_title);
    formData.append("game_thumbnail", newGameListData.game_thumbnail);
    formData.append("game_background_image", newGameListData.game_background_image);
    formData.append("game_starting_price", newGameListData.game_starting_price);
    formData.append("game_status", newGameListData.game_status);
    formData.append("game_duration_seconds", newGameListData.game_duration_seconds);
    formData.append("game_freeze_seconds", newGameListData.game_freeze_seconds);
    formData.append("game_category_id", newGameListData.game_category_id);
    formData.append("game_secondary_background_image", newGameListData.game_secondary_background_image);
    formData.append("game_max_price", newGameListData.game_max_price);
    formData.append("game_not_played", newGameListData.game_not_played);
    
    dispatch(AddGameListData(formData))
      .then(() => {
        setIsSaveLoading(false);
        Toast({
          title: "GameList updated/deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        setNewGameListData({
          game_title: "",
          game_thumbnail: "",
          game_background_image: "",
          game_starting_price: "",
          game_status: "",
          game_duration_seconds: "",
          game_freeze_seconds: "",
          game_category_id: "",
          game_secondary_background_image: "",
          game_max_price: "",
          game_not_played: "",
        });
        setSelectedFile(null);
        setIsAddGameListModalOpen(false);
        dispatch(fetchGameListData());
      })
      .catch((error) => {
        setIsSaveLoading(false);
        console.error("Error adding GameList:", error);
        Toast({
          title: "Failed to add GameList",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      });
  };

  const handleDeleteGameList = () => {
    setIsSaveLoading(true);
    dispatch(deleteGameListData(GameListToDelete.GameList_id))
      .then(() => {
        setIsDeleteModalOpen(false);
        setIsSaveLoading(false);
        Toast({
          title: "GameList added/updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((error) => {
        setIsSaveLoading(false);
        Toast({
          title: "Failed to delete GameList",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        console.log("Error deleting PlayRecords: ", error);
      });
  };

  const handleSaveChanges = () => {
    setIsSaveLoading(true);
    const formData = new FormData();
    // Append updated GameList data to FormData
    formData.append("GameList_title", editedGameListData.GameList_title);
    formData.append("GameList_info", editedGameListData.GameList_info);
    formData.append("GameList_type", editedGameListData.GameList_type);

    dispatch(updateGameListData(editedGameListData.GameList_id, formData))
      .then(() => {
        setIsEditModalOpen(false);
        setIsSaveLoading(false);
        Toast({
          title: "GameList added/updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((error) => {
        setIsSaveLoading(false);
        Toast({
          title: "Failed to updating GameList",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        console.log("Error updating PlayRecords: ", error);
      });
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setNewGameListData({
        ...newGameListData,
        GameList_image: URL.createObjectURL(file),
      });
    } else {
      setSelectedFile(null);
      setNewGameListData({
        ...newGameListData,
        GameList_image: null,
      });
    }
  };

  const handleDeleteConfirmation = (GameList) => {
    setGameListToDelete(GameList);
    setIsDeleteModalOpen(true);
  };

  const handleEditGameList = (GameList) => {
    setEditedGameListData(GameList);
    setIsEditModalOpen(true);
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Text color="red">Error: {error}</Text>
      </Flex>
    );
  }

  return (
    <Box p="1" overflowX="auto">
      <Flex align="center" justify="space-between" mb="6" mt={5}>
        <Text fontSize="3xl" fontWeight="bold" ml={5}>
          Game List
        </Text>
        <Button
          colorScheme="teal"
          mr={5}
          onClick={() => setIsAddGameListModalOpen(true)}
        >
          Add GameList
        </Button>
      </Flex>
      <Flex flexWrap="wrap" justifyContent="space-around">
        {GameListData.map((GameList, index) => (
          <Box
            key={index}
            w="300px"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            m="2"
          >
            <Image
              src={GameList.game_thumbnail}
              alt={GameList.game_title}
              w="100%"
              h="200px"
              objectFit="cover"
            />
            <Box p="6">
              <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight">
                {GameList.game_title}
              </Box>
              <Box>
                <Text mt="2" color="gray.600">
                  {GameList.game_starting_price}
                </Text>
              </Box>
              <Box>
                <Text mt="2" color="gray.600">
                  {GameList.game_max_price}
                </Text>
              </Box>
              <Box>
                <Text mt="2" color="gray.600">
                  {GameList.game_status}
                </Text>
              </Box>
              <Flex mt="4">
                <Button
                  colorScheme="blue"
                  onClick={() => handleEditGameList(GameList)}
                  pl={3}
                  pr={3}
                >
                  Edit
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => handleDeleteConfirmation(GameList)}
                  ml={3}
                  pl={3}
                  pr={3}
                >
                  Delete
                </Button>
              </Flex>
            </Box>
          </Box>
        ))}
      </Flex>

      <Modal
        isOpen={isAddGameListModalOpen}
        onClose={() => setIsAddGameListModalOpen(false)}
      >
        <ModalOverlay />
        <form onSubmit={handleAddGameList}>
          <ModalContent>
            <ModalHeader>Add GameList</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                mb="3"
                placeholder="GameList Title"
                value={newGameListData.GameList_title}
                onChange={(e) =>
                  setNewGameListData({
                    ...newGameListData,
                    GameList_title: e.target.value,
                  })
                }
                required
              />
              <Input
                mb="3"
                placeholder="GameList Info"
                value={newGameListData.GameList_info}
                onChange={(e) =>
                  setNewGameListData({
                    ...newGameListData,
                    GameList_info: e.target.value,
                  })
                }
                required
              />
              <Input
                mb="3"
                placeholder="GameList Type"
                value={newGameListData.GameList_type}
                onChange={(e) =>
                  setNewGameListData({
                    ...newGameListData,
                    GameList_type: e.target.value,
                  })
                }
                required
              />
              {newGameListData.GameList_image && (
                <Box mb="3">
                  <Image
                    src={newGameListData.GameList_image}
                    alt="GameList Image Preview"
                    w="100%"
                    h="200px"
                    objectFit="cover"
                  />
                  {selectedFile && (
                    <Text color="gray.600" mt="2" ml="3">
                      {selectedFile.name}
                    </Text>
                  )}
                </Box>
              )}
              <Flex alignItems="center" mb="3">
                <label htmlFor="fileInput">
                  <Button as="span" ml="2" colorScheme="teal">
                    Upload Image
                  </Button>
                </label>
                <input
                  id="fileInput"
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleFileInputChange}
                />
              </Flex>
            </ModalBody>
            <ModalFooter>
              <Button
                type="submit"
                colorScheme="teal"
                mr={2}
                isLoading={isSaveLoading}
                spinner={<BeatLoader size={8} color="white" />}
              >
                Submit
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsAddGameListModalOpen(false)}
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete "{GameListToDelete?.GameList_title}
            "?
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              colorScheme="red"
              onClick={handleDeleteGameList}
              isLoading={isSaveLoading}
              spinner={<BeatLoader size={8} color="white" />}
            >
              Delete
            </Button>
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit GameList</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              mb="3"
              placeholder="GameList Title"
              value={editedGameListData?.GameList_title || ""}
              onChange={(e) =>
                setEditedGameListData({
                  ...editedGameListData,
                  GameList_title: e.target.value,
                })
              }
              required
            />
            <Input
              mb="3"
              placeholder="GameList Info"
              value={editedGameListData?.GameList_info || ""}
              onChange={(e) =>
                setEditedGameListData({
                  ...editedGameListData,
                  GameList_info: e.target.value,
                })
              }
              required
            />
            <Input
              mb="3"
              placeholder="GameList Type"
              value={editedGameListData?.GameList_type || ""}
              onChange={(e) =>
                setEditedGameListData({
                  ...editedGameListData,
                  GameList_type: e.target.value,
                })
              }
              required
            />
            <Flex alignItems="center" mb="3">
              <label htmlFor="editFileInput">
                <Button as="span" ml="2" colorScheme="teal">
                  Change Image
                </Button>
              </label>
              <input
                id="editFileInput"
                type="file"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setEditedGameListData({
                      ...editedGameListData,
                      GameList_image: URL.createObjectURL(file),
                    });
                    setSelectedFile(file);
                  }
                }}
              />
            </Flex>
            {editedGameListData && editedGameListData.GameList_image && (
              <Box mb="3">
                <Image
                  src={editedGameListData.GameList_image}
                  alt="GameList Image Preview"
                  w="100%"
                  h="200px"
                  objectFit="cover"
                />
                {selectedFile && (
                  <Text color="gray.600" mt="2" ml="3">
                    {selectedFile.name}
                  </Text>
                )}
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              isLoading={isSaveLoading}
              colorScheme="teal"
              mr={2}
              onClick={handleSaveChanges}
              spinner={<BeatLoader size={8} color="white" />}
            >
              Save Changes
            </Button>
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
