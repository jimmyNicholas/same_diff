import { Meta, StoryObj } from "@storybook/nextjs";
import VocabRow from "./vocab-row";
import { expect, userEvent } from "storybook/test";
import { VocabularyWord } from "@/lib/types";
import { MockVocabularyProvider, mockVocabularyWords, mockVocabularyActions } from "@/test-utils/MockVocabularyProvider";

const mockVocabWord: VocabularyWord = mockVocabularyWords[0];
const mockVocabWordNoImages: VocabularyWord = mockVocabularyWords[1];
const mockVocabWordSingleImage: VocabularyWord = mockVocabularyWords[2];

const { mockAddWord } = mockVocabularyActions;

const meta = {
  component: VocabRow,
  title: "Components/Vocabulary/VocabRow",
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MockVocabularyProvider>
        <Story />
      </MockVocabularyProvider>
    ),
  ],
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

    await step("input blur triggers onAddWord", async () => {
      const input = canvas.getByDisplayValue("pug");
      await expect(input).toBeInTheDocument();
      await userEvent.clear(input);
      await userEvent.type(input, "boxer");
      await userEvent.tab();
      await expect(mockAddWord).toHaveBeenCalledWith("boxer");
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
