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
  Select,
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
import {
  fetchCategoryData,
  selectCategoryData,
} from "../../../app/Slices/CategorySlice";

export default function GameList() {
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
  const [gameListToDelete, setGameListToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedGameListData, setEditedGameListData] = useState(null);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  const gameListData = useSelector(selectGameListData);
  const categoryData = useSelector(selectCategoryData);
  const isLoading = useSelector(selectGameListLoading);
  const error = useSelector(selectGameListError);
  const dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    dispatch(fetchGameListData());
    dispatch(fetchCategoryData());
  }, [dispatch]);

  const handleAddGameList = (e) => {
    e.preventDefault();

    setIsSaveLoading(true);

    const formData = new FormData();
    formData.append("game_title", newGameListData.game_title);
    formData.append("game_info", newGameListData.game_info);
    formData.append(
      "game_duration_seconds",
      newGameListData.game_duration_seconds
    );
    formData.append("game_freeze_seconds", newGameListData.game_freeze_seconds);
    formData.append("game_starting_price", newGameListData.game_starting_price);
    formData.append("game_max_price", newGameListData.game_max_price);
    formData.append("game_not_played", newGameListData.game_not_played);
    formData.append("game_category_id", newGameListData.game_category_id);
    formData.append("game_status", newGameListData.game_status);

    if (selectedFile) {
      formData.append("game_thumbnail", selectedFile);
    }

    dispatch(AddGameListData(formData))
      .then(() => {
        setIsSaveLoading(false);
        toast({
          title: "GameList added successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        setNewGameListData({
          game_title: "",
          game_info: "",
          game_duration_seconds: "",
          game_freeze_seconds: "",
          game_starting_price: "",
          game_max_price: "",
          game_not_played: "",
          game_category_id: "",
          game_status: "",
        });
        setSelectedFile(null);
        setIsAddGameListModalOpen(false);
        dispatch(fetchGameListData());
      })
      .catch((error) => {
        setIsSaveLoading(false);
        console.error("Error adding GameList:", error);
        toast({
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
    dispatch(deleteGameListData(gameListToDelete.game_id))
      .then(() => {
        setIsDeleteModalOpen(false);
        setIsSaveLoading(false);
        toast({
          title: "GameList deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        dispatch(fetchGameListData());
      })
      .catch((error) => {
        setIsSaveLoading(false);
        toast({
          title: "Failed to delete GameList",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        console.error("Error deleting GameList:", error);
      });
  };

  const handleSaveChanges = () => {
    setIsSaveLoading(true);
  
    const { game_id, ...updatedGameData } = editedGameListData;
  
    updatedGameData.game_thumbnail = selectedFile || updatedGameData.game_thumbnail;
  
    dispatch(updateGameListData(updatedGameData.game_id, formData))
    .then(() => {
        setIsEditModalOpen(false);
        setIsSaveLoading(false);
        toast({
          title: "GameList updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((error) => {
        setIsSaveLoading(false);
        toast({
          title: "Failed to update GameList",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        console.error("Error updating GameList:", error);
      });
  };
  
  

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setNewGameListData({
        ...newGameListData,
        game_thumbnail: URL.createObjectURL(file),
      });
    } else {
      setSelectedFile(null);
      setNewGameListData({
        ...newGameListData,
        game_thumbnail: null,
      });
    }
  };

  const handleDeleteConfirmation = (gameList) => {
    setGameListToDelete(gameList);
    setIsDeleteModalOpen(true);
  };

  const handleEditGameList = (gameList) => {
    setEditedGameListData(gameList);
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
        {gameListData.map((gameList, index) => (
          <Box
            key={index}
            w="300px"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            m="2"
          >
            <Image
              src={gameList.game_thumbnail}
              alt={gameList.game_title}
              w="100%"
              h="200px"
              objectFit="cover"
            />
            <Box p="6">
              <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight">
                {gameList.game_title}
              </Box>
              <Box>
                <Text mt="2" color="gray.600">
                  {gameList.game_starting_price}
                </Text>
              </Box>
              <Box>
                <Text mt="2" color="gray.600">
                  {gameList.game_max_price}
                </Text>
              </Box>
              <Box>
                <Text mt="2" color="gray.600">
                  {gameList.game_status}
                </Text>
              </Box>
              <Flex mt="4">
                <Button
                  colorScheme="blue"
                  onClick={() => handleEditGameList(gameList)}
                  pl={3}
                  pr={3}
                >
                  Edit
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => handleDeleteConfirmation(gameList)}
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
                value={newGameListData.game_title}
                onChange={(e) =>
                  setNewGameListData({
                    ...newGameListData,
                    game_title: e.target.value,
                  })
                }
                required
              />
              <Input
                mb="3"
                placeholder="GameList Info"
                value={newGameListData.game_info}
                onChange={(e) =>
                  setNewGameListData({
                    ...newGameListData,
                    game_info: e.target.value,
                  })
                }
                required
              />
              <Input
                mb="3"
                placeholder="Game duration seconds"
                value={newGameListData.game_duration_seconds}
                onChange={(e) =>
                  setNewGameListData({
                    ...newGameListData,
                    game_duration_seconds: e.target.value,
                  })
                }
                required
              />
              <Input
                mb="3"
                placeholder="Game freeze seconds"
                value={newGameListData.game_freeze_seconds}
                onChange={(e) =>
                  setNewGameListData({
                    ...newGameListData,
                    game_freeze_seconds: e.target.value,
                  })
                }
                required
              />
              <Input
                mb="3"
                placeholder="Game starting price "
                value={newGameListData.game_starting_price}
                onChange={(e) =>
                  setNewGameListData({
                    ...newGameListData,
                    game_starting_price: e.target.value,
                  })
                }
                required
              />
              <Input
                mb="3"
                placeholder="game_max_price "
                value={newGameListData.game_max_price}
                onChange={(e) =>
                  setNewGameListData({
                    ...newGameListData,
                    game_max_price: e.target.value,
                  })
                }
                required
              />
              <Input
                mb="3"
                placeholder="Game not played "
                value={newGameListData.game_not_played}
                onChange={(e) =>
                  setNewGameListData({
                    ...newGameListData,
                    game_not_played: e.target.value,
                  })
                }
                required
              />
              <Select
                mb="3"
                placeholder="Select Category"
                value={newGameListData.game_category_id}
                onChange={(e) =>
                  setNewGameListData({
                    ...newGameListData,
                    game_category_id: e.target.value,
                  })
                }
                isRequired
              >
                {categoryData.map((category) => (
                  <option
                    key={category.category_id}
                    value={category.category_id}
                  >
                    {category.category_title}
                  </option>
                ))}
              </Select>
              <Select
                mb="3"
                placeholder="Select Status"
                value={newGameListData?.game_status || ""}
                onChange={(e) =>
                  setNewGameListData({
                    ...newGameListData,
                    game_status: e.target.value,
                  })
                }
                required
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
              {newGameListData.game_thumbnail && (
                <Box mb="3">
                  <Image
                    src={newGameListData.game_thumbnail}
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
            Are you sure you want to delete "{gameListToDelete?.game_title}"?
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
              value={editedGameListData?.game_title || ""}
              onChange={(e) =>
                setEditedGameListData({
                  ...editedGameListData,
                  game_title: e.target.value,
                })
              }
              required
            />
            <Input
              mb="3"
              placeholder="GameList Info"
              value={editedGameListData?.game_info || ""}
              onChange={(e) =>
                setEditedGameListData({
                  ...editedGameListData,
                  game_info: e.target.value,
                })
              }
              required
            />
            <Input
              mb="3"
              placeholder="Game Not Played"
              value={editedGameListData?.game_not_played || ""}
              onChange={(e) =>
                setEditedGameListData({
                  ...editedGameListData,
                  game_not_played: e.target.value,
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
                      game_thumbnail: URL.createObjectURL(file),
                    });
                    setSelectedFile(file);
                  }
                }}
              />
            </Flex>
            {editedGameListData && editedGameListData.game_thumbnail && (
              <Box mb="3">
                <Image
                  src={editedGameListData.game_thumbnail}
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