import { Meta, StoryObj } from "@storybook/nextjs";
import Picture from "./picture";
import { expect, userEvent } from "storybook/test";

const meta = {
  component: Picture,
  title: "Components/ui/Picture",
  tags: ["autodocs"],
  args: {
    id: "1",
    enabled: false,
    loading: false,
    src: "/images/placeholder.jpg",
    alt: "Placeholder Image",
    size: "md",
  },
  argTypes: {
    id: {
      control: "text",
    },
    enabled: {
      control: "boolean",
    },
    loading: {
      control: "boolean",
    },
    src: {
      control: "text",
    },
    alt: {
      control: "text",
    },
    size: {
      options: ["sm", "md", "lg"],
      defaultValue: "md",
    },
  },
} satisfies Meta<typeof Picture>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Enabled: Story = {
  args: {
    enabled: true,
    src: "/images/placeholder.jpg",
    alt: "Test image",
  },
};

export const Loading: Story = {
  args: {
    enabled: false,
    loading: true,
  },
};

export const Small: Story = {
  args: {
    enabled: true,
    src: "/images/placeholder.jpg",
    alt: "Test image",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    enabled: true,
    src: "/images/placeholder.jpg",
    alt: "Test image",
    size: "lg",
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
  },
  args: {
    enabled: false,
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
  },
  args: {
    enabled: false,
    loading: true,
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
    

    // previous and next image buttons
    const previousImageButton = canvas.getByTestId("previous-image-button-1");
    await expect(previousImageButton).toBeInTheDocument();
    await userEvent.click(previousImageButton);

    const nextImageButton = canvas.getByTestId("next-image-button-1");
    await expect(nextImageButton).toBeInTheDocument();
    await userEvent.click(nextImageButton);

    // get image button is null
    await expect(canvas.queryByTestId("get-image-button-1")).toBeNull();
  },
  args: {
    enabled: true,
  },
};
