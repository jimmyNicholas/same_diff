import type { Meta, StoryObj } from "@storybook/nextjs";
import AdminActivities from "./page";
import { MockVocabularyProvider, mockVocabularyWords } from "@/test-utils/MockVocabularyProvider";

const meta = {
  component: AdminActivities,
  decorators: [
    (Story) => (
      <MockVocabularyProvider>
        <Story />
      </MockVocabularyProvider>
    ),
  ],
  title: "Pages/Admin/Activities",
  tags: ["autodocs"],
} satisfies Meta<typeof AdminActivities>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithVocabRow: Story = {
  args: {
    vocabRow: mockVocabularyWords[0],
  },
};