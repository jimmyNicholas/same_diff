import { Meta, StoryObj } from "@storybook/nextjs";
import PictureContainer from "./picture-container";
import { expect, fn } from "storybook/test";

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

// const testingPictures: PictureProps[] = [
//   {
//     id: "1",
//     enabled: true,
//     loading: false,
//     src: "/images/placeholder.jpg",
//     alt: "Test image 1",
//     size: "md",
//     getImage: fn(),
//     closeImage: fn(),
//     previousImage: fn(),
//     nextImage: fn(),
//   },
//   {
//     id: "2",
//     enabled: false,
//     loading: false,
//     src: "/images/placeholder.jpg",
//     alt: "Test image 3",
//     size: "md",
//     getImage: fn(),
//     closeImage: fn(),
//     previousImage: fn(),
//     nextImage: fn(),
//   },
//   {
//     id: "3",
//     enabled: false,
//     loading: true,
//     src: "/images/placeholder.jpg",
//     alt: "Test image 1",
//     size: "md",
//     getImage: fn(),
//     closeImage: fn(),
//     previousImage: fn(),
//     nextImage: fn(),
//   },
// ];

export const TestingSorting: Story = {
  play: async ({ canvas, step }) => {
    await step("enabled pictures appear first", async () => {
      await expect(canvas.getByTestId("picture-1")).toBeInTheDocument();
      await expect(canvas.getByTestId("picture-2")).toBeInTheDocument();
      await expect(canvas.getByTestId("picture-3")).toBeInTheDocument();
    });

    // Verify order: enabled pictures first, then disabled
    await step("order of pictures", async () => {
      const container = canvas.getByTestId("picture-container");
      const pictureElements = container.querySelectorAll(
        '[data-testid^="picture-"]'
      );

      const enabledTestId = "picture-2";
      const disabledTestId = "picture-3";
      const loadingTestId = "picture-1";

      await expect(pictureElements[0]).toHaveAttribute(
        "data-testid",
        enabledTestId
      );
      await expect(pictureElements[1]).toHaveAttribute(
        "data-testid",
        disabledTestId
      );
      await expect(pictureElements[2]).toHaveAttribute(
        "data-testid",
        loadingTestId
      );
    });
  },
  args: {
    pictures: [
      {
        id: "1",
        enabled: false,
        loading: false,
        src: "/images/placeholder.jpg",
        alt: "Test 1",
        size: "md",
      },
      {
        id: "2",
        enabled: true,
        loading: false,
        src: "/images/placeholder.jpg",
        alt: "Test 2",
        size: "md",
      },
      {
        id: "3",
        enabled: false,
        loading: true,
        src: "/images/placeholder.jpg",
        alt: "Test 3",
        size: "md",
      },
    ],
  },
};
