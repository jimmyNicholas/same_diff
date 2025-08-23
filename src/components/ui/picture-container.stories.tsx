import { Meta, StoryObj } from "@storybook/nextjs";
import PictureContainer from "./picture-container";
import { expect } from "storybook/test";

const meta = {
  component: PictureContainer,
  title: "Components/ui/PictureContainer",
  tags: ["autodocs"],
  args: {
    pictures: Array.from({ length: 5 }, (_, index) => ({
      id: `${index + 1}`,
      enabled: true,
      loading: false,
      src: "/images/placeholder.jpg",
      alt: `Test image ${index + 1}`,
      size: "md",
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

      const enabledTestIds = ["picture-2", "picture-5"];
      const disabledTestIds = ["picture-1"];
      const loadingTestIds = ["picture-3", "picture-4"];

      await expect(enabledTestIds).toContain(
        pictureElements[0].getAttribute("data-testid")
      );
      await expect(enabledTestIds).toContain(
        pictureElements[1].getAttribute("data-testid")
      );

      await expect(loadingTestIds).toContain(
        pictureElements[2].getAttribute("data-testid")
      );
      await expect(loadingTestIds).toContain(
        pictureElements[3].getAttribute("data-testid")
      );

      await expect(disabledTestIds).toContain(
        pictureElements[4].getAttribute("data-testid")
      );
    });
  },
  args: {
    pictures: [
      // disabled
      {
        id: "1",
        enabled: false,
        loading: false,
        src: "/images/placeholder.jpg",
        alt: "Test 1",
        size: "md",
      },
      // enabled
      {
        id: "2",
        enabled: true,
        loading: false,
        src: "/images/placeholder.jpg",
        alt: "Test 2",
        size: "md",
      },
      // loading
      {
        id: "3",
        enabled: false,
        loading: true,
        src: "/images/placeholder.jpg",
        alt: "Test 3",
        size: "md",
      },
      // loading
      {
        id: "4",
        enabled: false,
        loading: true,
        src: "/images/placeholder.jpg",
        alt: "Test 4",
        size: "md",
      },
      // enabled
      {
        id: "5",
        enabled: true,
        loading: false,
        src: "/images/placeholder.jpg",
        alt: "Test 5",
        size: "md",
      },
    ],
  },
};
