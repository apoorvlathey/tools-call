"use client";

import { useChat } from "@ai-sdk/react";
import {
  Box,
  Container,
  VStack,
  Input,
  Text,
  Flex,
  Button,
  Heading,
  Badge,
  Spacer,
} from "@chakra-ui/react";
import { FiSend, FiUser, FiMessageSquare, FiLoader } from "react-icons/fi";
import { useRef, useEffect } from "react";

// Add a global style for the animation
const globalStyles = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      maxSteps: 10,
    });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Dark mode colors
  const userBgColor = "blue.800";
  const aiBgColor = "gray.700";
  const textColor = "gray.100";
  const borderColor = "gray.600";
  const headerBgColor = "gray.800";
  const inputBgColor = "gray.700";
  const subtleTextColor = "gray.400";

  // Handle submit with validation
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) {
      return;
    }
    handleSubmit(e);
  };

  return (
    <Box
      h={{ base: "90vh", md: "100vh" }}
      display="flex"
      flexDirection="column"
      maxW={{ base: "100%", md: "800px", lg: "900px" }}
      mx="auto"
      boxShadow={{ md: "lg" }}
      borderWidth={{ md: "1px" }}
      borderColor={{ md: borderColor }}
      overflow="hidden"
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom={{ base: "auto", md: "0" }}
    >
      {/* Global styles */}
      <style jsx global>
        {globalStyles}
      </style>

      {/* Header */}
      <Box
        py={3}
        px={4}
        bg={headerBgColor}
        boxShadow="sm"
        position="sticky"
        top={0}
        zIndex={10}
        borderBottomWidth="1px"
        borderColor={borderColor}
      >
        <Flex align="center" maxW="100%" mx="auto" px={{ base: 1, md: 3 }}>
          <Box as={FiMessageSquare} boxSize={6} color="blue.500" />
          <Heading size="md" ml={2}>
            AI Chat
          </Heading>
          <Spacer />
          <Badge
            colorScheme="blue"
            variant="subtle"
            fontSize="sm"
            p={1}
            borderRadius="md"
          >
            {messages.length} messages
          </Badge>
        </Flex>
      </Box>

      {/* Chat Area */}
      <Box
        flex="1"
        overflow="auto"
        py={4}
        px={{ base: 2, md: 4 }}
        bgGradient="linear(to-b, gray.900, gray.800)"
      >
        <Container maxW="100%" px={{ base: 1, md: 3 }}>
          {messages.length === 0 ? (
            <Flex
              direction="column"
              align="center"
              justify="center"
              h="100%"
              opacity={0.7}
              mt={20}
            >
              <Box as={FiMessageSquare} boxSize={12} color="blue.400" />
              <Text mt={4} fontSize="lg" fontWeight="medium">
                Start a conversation
              </Text>
              <Text
                fontSize="sm"
                textAlign="center"
                mt={2}
                color={subtleTextColor}
              >
                Type a message below to begin chatting with the AI
              </Text>
            </Flex>
          ) : (
            <VStack gap={4} align="stretch">
              {messages.map((message) => (
                <Box key={message.id} position="relative" transition="all 0.2s">
                  <Flex
                    direction={message.role === "user" ? "row-reverse" : "row"}
                    align="start"
                    gap={2}
                  >
                    <Box
                      borderRadius="full"
                      bg={message.role === "user" ? "blue.500" : "gray.500"}
                      p={2}
                      color="white"
                      boxShadow="sm"
                    >
                      {message.role === "user" ? (
                        <Box as={FiUser} boxSize={4} />
                      ) : (
                        <Box as={FiMessageSquare} boxSize={4} />
                      )}
                    </Box>
                    <Box
                      maxW={{ base: "75%", md: "80%" }}
                      borderRadius="lg"
                      px={4}
                      py={3}
                      bg={message.role === "user" ? userBgColor : aiBgColor}
                      borderWidth="1px"
                      borderColor={borderColor}
                      boxShadow="sm"
                    >
                      {message.parts.map((part, i) => {
                        switch (part.type) {
                          case "text":
                            return (
                              <Text
                                key={`${message.id}-${i}`}
                                color={textColor}
                              >
                                {part.text}
                              </Text>
                            );
                          default:
                            return null;
                        }
                      })}
                    </Box>
                  </Flex>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </VStack>
          )}
        </Container>
      </Box>

      {/* Input Area */}
      <Box
        py={3}
        px={{ base: 2, md: 4 }}
        borderTopWidth="1px"
        borderColor={borderColor}
        bg={headerBgColor}
        position="sticky"
        bottom={0}
        width="100%"
      >
        <Container maxW="100%" px={{ base: 1, md: 3 }}>
          <form onSubmit={onSubmit} style={{ width: "100%" }}>
            <Flex gap={2}>
              <Input
                pl={4}
                py={{ base: 5, md: 6 }}
                value={input}
                placeholder="Type your message..."
                onChange={handleInputChange}
                borderRadius="full"
                bg={inputBgColor}
                borderColor={borderColor}
                color={textColor}
                _hover={{ borderColor: "blue.400" }}
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
                }}
              />
              <Button
                type="submit"
                colorScheme="blue"
                disabled={isLoading}
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                minW={{ base: "40px", md: "50px" }}
                h={{ base: "40px", md: "50px" }}
                p={0}
              >
                {isLoading ? (
                  <Box
                    as={FiLoader}
                    boxSize={{ base: 5, md: 6 }}
                    style={{ animation: "spin 1.5s linear infinite" }}
                  />
                ) : (
                  <Box as={FiSend} boxSize={{ base: 5, md: 6 }} />
                )}
              </Button>
            </Flex>
          </form>
        </Container>
      </Box>
    </Box>
  );
}
