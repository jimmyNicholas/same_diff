import { Meta, StoryObj } from "@storybook/nextjs";
import Picture from "./picture";
import { expect, userEvent } from "storybook/test";
import { MockVocabularyProvider, mockVocabularyActions } from "@/test-utils/MockVocabularyProvider";

const { mockShowImage, mockHideImage, mockNavigateImage } = mockVocabularyActions;

const MockProvider = ({ children }: { children: React.ReactNode }) => (
  <MockVocabularyProvider>
    {children}
  </MockVocabularyProvider>
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
    wordId: "1",
    pictureId: "1",
    status: "disabled",
    image: {
      wordId: "1",
      pictureId: "1",
      status: "disabled",
      src: "/images/placeholder.jpg",
      alt: "Placeholder Image",
    },
  },
  argTypes: {
    wordId: {
      control: "text",
    },
    pictureId: {
      control: "text",
    },
    status: {
      control: "select",
      options: ["enabled", "disabled", "loading", "error"],
    },
    image: {
      control: "object",
    },
  },
} satisfies Meta<typeof Picture>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Enabled: Story = {
  args: {
    status: "enabled",
    image: {
      wordId: "1",
      pictureId: "1",
      status: "enabled",
      src: "/images/placeholder.jpg",
      alt: "Test image",
    },
  },
};

export const Loading: Story = {
  args: {
    status: "loading",
    image: {
      wordId: "1",
      pictureId: "1",
      status: "loading",
      src: "/images/placeholder.jpg",
      alt: "Test image",
    },
  },
};

export const TestingDisabledPicture: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId("picture-1")).toBeInTheDocument();
    await expect(canvas.queryByTestId("close-image-button-1")).toBeNull();
    await expect(canvas.queryByTestId("previous-image-button-1")).toBeNull();
    await expect(canvas.queryByTestId("next-image-button-1")).toBeNull();
    await expect(canvas.getByTestId("get-image-button-1")).toBeInTheDocument();

    await userEvent.click(canvas.getByTestId("get-image-button-1"));
    await expect(mockShowImage).toHaveBeenCalled();
  },
  args: {
    status: "disabled",
    image: {
      wordId: "1",
      pictureId: "1",
      status: "disabled",
      src: "/images/placeholder.jpg",
      alt: "Placeholder Image",
    },
  },
};

export const TestingLoadingPicture: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId("picture-1")).toBeInTheDocument();
    await expect(canvas.queryByTestId("close-image-button-1")).toBeNull();
    await expect(canvas.queryByTestId("previous-image-button-1")).toBeNull();
    await expect(canvas.queryByTestId("next-image-button-1")).toBeNull();
    await expect(canvas.getByTestId("get-image-button-1")).toBeInTheDocument();
    await userEvent.click(canvas.getByTestId("get-image-button-1"));
    await expect(mockShowImage).not.toHaveBeenCalled();
  },
  args: {
    status: "loading",
    image: {
      wordId: "1",
      pictureId: "1",
      status: "loading",
      src: "/images/placeholder.jpg",
      alt: "Test image",
    },
  },
};

export const TestingEnabledPicture: Story = {
  play: async ({ canvas }) => {
    const picture = canvas.getByTestId("picture-1");
    await expect(picture).toBeInTheDocument();

    // close image button
    const closeImageButton = canvas.getByTestId("close-image-button-1");
    await expect(closeImageButton).toBeInTheDocument();
    await userEvent.click(closeImageButton);
    await expect(mockHideImage).toHaveBeenCalled();

    // previous and next image buttons
    const previousImageButton = canvas.getByTestId("previous-image-button-1");
    await expect(previousImageButton).toBeInTheDocument();
    await userEvent.click(previousImageButton);
    await expect(mockNavigateImage).toHaveBeenCalled();

    const nextImageButton = canvas.getByTestId("next-image-button-1");
    await expect(nextImageButton).toBeInTheDocument();
    await userEvent.click(nextImageButton);
    await expect(mockNavigateImage).toHaveBeenCalled();

    // get image button is null
    await expect(canvas.queryByTestId("get-image-button-1")).toBeNull();
  },
  args: {
    status: "enabled",
    image: {
      wordId: "1",
      pictureId: "1",
      status: "enabled",
      src: "/images/placeholder.jpg",
      alt: "Test image",
    },
  },
};
