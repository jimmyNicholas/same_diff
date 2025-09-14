import { Meta, StoryObj } from "@storybook/nextjs";
import Picture from "./picture";
import {
  MockVocabularyProvider,
  mockVocabularyActions,
  mockVocabularyWords,
} from "@/test-utils/MockProvider";
import { expect, fn, userEvent } from "storybook/test";

// const { mockOnImageClick } =
//   mockVocabularyActions;

const MockProvider = ({ children }: { children: React.ReactNode }) => (
  <MockVocabularyProvider>{children}</MockVocabularyProvider>
);

const meta = {
  component: Picture,
  title: "Components/ui/Picture",
  decorators: [
    (Story) => (
      <MockProvider>
        <Story />
      </MockProvider>
    ),
  ],
  tags: ["autodocs"],
  args: {
    image: {
      id: "1",
      urls: {
        thumb: "/images/placeholder.jpg",
        small: "/images/placeholder.jpg",
        regular: "/images/placeholder.jpg",
        full: "/images/placeholder.jpg",
      },
      alt: "Placeholder Image",
    },
    onImageClick: fn(),
  },
} satisfies Meta<typeof Picture>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    image: mockVocabularyWords[0].images[0],
  },
};

export const TestingImageClick: Story = {
  play: async ({ canvas, step, args }) => {
    await expect(canvas.getByTestId("1")).toBeInTheDocument();

    await step("close image button is in the document", async () => {
      const closeImageButton = canvas.getByTestId("close-image-button");
      await expect(closeImageButton).toBeInTheDocument();
      await userEvent.click(closeImageButton);
      expect(args.onImageClick).toHaveBeenCalledWith("DELETE", "1");
    });
    await step("previous image button is in the document", async () => {
      const previousImageButton = canvas.getByTestId("previous-image-button");
      await expect(previousImageButton).toBeInTheDocument();
      await userEvent.click(previousImageButton);
      expect(args.onImageClick).toHaveBeenCalledWith("PREV", "1");
    });
    await step("next image button is in the document", async () => {
      const nextImageButton = canvas.getByTestId("next-image-button");
      await expect(nextImageButton).toBeInTheDocument();
      await userEvent.click(nextImageButton);
      expect(args.onImageClick).toHaveBeenCalledWith("NEXT", "1");
    });
  },
};
