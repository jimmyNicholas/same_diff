import { Meta, StoryObj } from "@storybook/nextjs";
import VocabRow from "./vocab-row";
import { expect, userEvent } from "storybook/test";
import { MockVocabularyProvider, mockVocabularyWords, mockVocabularyActions } from "@/test-utils/MockProvider";


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
    vocabularyWords: mockVocabularyWords,
    manageVocabulary: mockAddWord,
  },
  argTypes: {
    vocabularyWords: {
      control: "object",
    },
  },
} satisfies Meta<typeof VocabRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
