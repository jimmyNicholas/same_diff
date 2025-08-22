import { Meta, StoryObj } from "@storybook/nextjs";
import PictureContainer from "./picture-container";
import { expect, fn } from "storybook/test";
import { PictureProps } from "./picture";

const meta = {
  component: PictureContainer,
  title: "PictureContainer",
  tags: ["autodocs"],
  args: {
    pictures: Array.from({ length: 5 }, (_, index) => ({
      id: `${index + 1}`,
      enabled: true,
      loading: false,
      src: "/images/placeholder.jpg",
      alt: `Test image ${index + 1}`,
      size: "md",
      getImage: fn(),
      closeImage: fn(),
      previousImage: fn(),
      nextImage: fn(),
    })),
  },
} satisfies Meta<typeof PictureContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    pictures: Array(5).fill({ enabled: false, loading: false }),
  },
};

export const WithImages: Story = {};

export const StateMix: Story = {
  args: {
    pictures: [
      {
        id: "1",
        enabled: true,
        loading: false,
        src: "/images/placeholder.jpg",
        alt: "Test image 1",
        size: "md",
      },
      {
        id: "2",
        enabled: true,
        loading: false,
        src: "/images/placeholder.jpg",
        alt: "Test image 1",
        size: "md",
      },
      {
        id: "3",
        enabled: false,
        loading: true,
        src: "/images/placeholder.jpg",
        alt: "Test image 2",
        size: "md",
      },
      {
        id: "4",
        enabled: false,
        loading: false,
        src: "/images/placeholder.jpg",
        alt: "Test image 3",
        size: "md",
      },
      {
        id: "5",
        enabled: false,
        loading: false,
        src: "/images/placeholder.jpg",
        alt: "Test image 3",
        size: "md",
      },
    ],
  },
};

export const SortedStateMix: Story = {
  args: {
    pictures: [
      {
        id: "1",
        enabled: true,
        loading: false,
        src: "/images/placeholder.jpg",
        alt: "Test image 1",
        size: "md",
      },
      {
        id: "2",
        enabled: false,
        loading: false,
        src: "/images/placeholder.jpg",
        alt: "Test image 3",
        size: "md",
      },
      {
        id: "3",
        enabled: true,
        loading: false,
        src: "/images/placeholder.jpg",
        alt: "Test image 1",
        size: "md",
      },
      {
        id: "4",
        enabled: false,
        loading: true,
        src: "/images/placeholder.jpg",
        alt: "Test image 2",
        size: "md",
      },
      {
        id: "5",
        enabled: false,
        loading: false,
        src: "/images/placeholder.jpg",
        alt: "Test image 3",
        size: "md",
      },
    ],
  },
};

const testingPictures: PictureProps[] = [
  {
    id: "1",
    enabled: true,
    loading: false,
    src: "/images/placeholder.jpg",
    alt: "Test image 1",
    size: "md",
    getImage: fn(),
    closeImage: fn(),
    previousImage: fn(),
    nextImage: fn(),
  },
  {
    id: "2",
    enabled: false,
    loading: false,
    src: "/images/placeholder.jpg",
    alt: "Test image 3",
    size: "md",
    getImage: fn(),
    closeImage: fn(),
    previousImage: fn(),
    nextImage: fn(),
  },
  {
    id: "3",
    enabled: false,
    loading: true,
    src: "/images/placeholder.jpg",
    alt: "Test image 1",
    size: "md",
    getImage: fn(),
    closeImage: fn(),
    previousImage: fn(),
    nextImage: fn(),
  },
];

export const TestingEnabledPicture: Story = {
  play: async ({ canvas, userEvent, args }) => {
    const enabledPictureArgs = args?.pictures[0];

    const picture = canvas.getByTestId("picture-1");
    await expect(picture).toBeInTheDocument();

    // close image button
    const closeImageButton = canvas.getByTestId("close-image-button-1");
    await expect(closeImageButton).toBeInTheDocument();
    await userEvent.click(closeImageButton);
    await expect(enabledPictureArgs.closeImage).toHaveBeenCalled();

    // previous and next image buttons
    const previousImageButton = canvas.getByTestId("previous-image-button-1");
    await expect(previousImageButton).toBeInTheDocument();
    await userEvent.click(previousImageButton);
    await expect(enabledPictureArgs.previousImage).toHaveBeenCalled();

    const nextImageButton = canvas.getByTestId("next-image-button-1");
    await expect(nextImageButton).toBeInTheDocument();
    await userEvent.click(nextImageButton);
    await expect(enabledPictureArgs.nextImage).toHaveBeenCalled();

    // get image button is null
    await expect(canvas.queryByTestId("get-image-button-1")).toBeNull();
  },
  args: {
    pictures: testingPictures,
  },
};

export const TestingDisabledPicture: Story = {
  play: async ({ canvas, userEvent, args }) => {
    const disabledPictureArgs = args?.pictures[1];

    const picture = canvas.getByTestId("picture-2");
    await expect(picture).toBeInTheDocument();

    // null for close image button, previous and next image buttons
    await expect(canvas.queryByTestId("close-image-button-2")).toBeNull();
    await expect(canvas.queryByTestId("previous-image-button-2")).toBeNull();
    await expect(canvas.queryByTestId("next-image-button-2")).toBeNull();

    // get image button
    const getImageButton = canvas.getByTestId("get-image-button-2");
    await expect(getImageButton).toBeInTheDocument();
    await userEvent.click(getImageButton);
    await expect(disabledPictureArgs.getImage).toHaveBeenCalled();
  },
  args: {
    pictures: testingPictures,
  },
};

export const TestingLoadingPicture: Story = {
    play: async ({ canvas, userEvent, args }) => {
        const loadingPictureArgs = args?.pictures[2];
    
        const picture = canvas.getByTestId("picture-3");
        await expect(picture).toBeInTheDocument();
    
        // null for close image button, previous and next image buttons
        await expect(canvas.queryByTestId("close-image-button-3")).toBeNull();
        await expect(canvas.queryByTestId("previous-image-button-3")).toBeNull();
        await expect(canvas.queryByTestId("next-image-button-3")).toBeNull();
    
        // get image button
        const getImageButton = canvas.getByTestId("get-image-button-3");
        await expect(getImageButton).toBeInTheDocument();
        await userEvent.click(getImageButton);
        await expect(loadingPictureArgs.getImage).not.toHaveBeenCalled();
      },
  args: {
    pictures: testingPictures,
  },
};
