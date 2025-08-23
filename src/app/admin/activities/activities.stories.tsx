import type { Meta, StoryObj } from "@storybook/nextjs";
import AdminActivities from "./page";
import { VocabularyWord } from "@/lib/types";

const mockVocabWord: VocabularyWord = {
  id: "1",
  word: "pug",
  definition: "A small breed of dog with a wrinkly face",
  imageUrl: ["/images/pug-1.jpg", "/images/pug-2.jpg"],
  createdAt: new Date("2024-01-01"),
};

const meta = {
  component: AdminActivities,
  title: "Pages/Admin/Activities",
  tags: ["autodocs"],
} satisfies Meta<typeof AdminActivities>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithVocabRow: Story = {
  args: {
    vocabRow: mockVocabWord,
  },
};