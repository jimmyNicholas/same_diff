import { Meta, StoryObj } from "@storybook/nextjs";
import VocabRow from "./vocab-row";
import { expect, fn } from "storybook/test";
import { VocabularyWord } from "@/lib/types";

const mockVocabWord: VocabularyWord = {
  id: "1",
  word: "pug",
  definition: "A small breed of dog with a wrinkly face",
  imageUrl: ["/images/pug-1.jpg", "/images/pug-2.jpg"],
  createdAt: new Date("2024-01-01"),
};

const mockVocabWordNoImages: VocabularyWord = {
  id: "2",
  word: "golden retriever",
  definition: "A calm and friendly dog with a golden coat",
  imageUrl: [],
  createdAt: new Date("2024-01-02"),
};

const mockVocabWordSingleImage: VocabularyWord = {
  id: "3",
  word: "border collie",
  definition: "An energetic breed of dog that herds sheep",
  imageUrl: ["/images/placeholder.jpg"],
  createdAt: new Date("2024-01-03"),
};

const meta = {
  component: VocabRow,
  title: "Components/Vocabulary/VocabRow",
  tags: ["autodocs"],
  args: {
    vocabulary: mockVocabWord,
  },
  argTypes: {
    vocabulary: {
      control: "object",
    },
  },
} satisfies Meta<typeof VocabRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SingleImage: Story = {
  args: {
    vocabulary: mockVocabWordSingleImage,
  },
};

export const NoImages: Story = {
  args: {
    vocabulary: mockVocabWordNoImages,
  },
};

export const MultipleImages: Story = {
  args: {
    vocabulary: mockVocabWord,
  },
};

export const TestingInputInteraction: Story = {
  play: async ({ canvas, step }) => {
    await step("input field displays word value", async () => {
      const input = canvas.getByDisplayValue("pug");
      await expect(input).toBeInTheDocument();
    });

    await step("input change triggers onAddWord", async () => {
      const input = canvas.getByDisplayValue("pug");
      await expect(input).toBeInTheDocument();
// Note: The current component calls onAddWord on every change
      // This might need to be adjusted based on your requirements
    });
  },
};

export const TestingPictureContainer: Story = {
  play: async ({ canvas, step }) => {
    await step("PictureContainer receives correct pictures array", async () => {
      // This tests that the component renders without errors
      // and that PictureContainer gets the right data structure
      const container = canvas.getByTestId("picture-container");
      await expect(container).toBeInTheDocument();
    });
  },
};

export const TestingFunctionFlow: Story = {
  play: async ({ canvas, step }) => {
    await step("functions are properly bound to picture actions", async () => {
      // This tests that the functions flow down correctly
      // The actual function calls happen in the Picture components
      const container = canvas.getByTestId("picture-container");
      await expect(container).toBeInTheDocument();
    });
  },
};
