import { Meta, StoryObj } from "@storybook/nextjs";
import Picture from "./picture";
import { expect } from "storybook/test";

const meta = {
  component: Picture,
  title: "Picture",
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
    getImage: { action: "getImage" },
    closeImage: { action: "closeImage" },
    previousImage: { action: "previousImage" },
    nextImage: { action: "nextImage" },
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

export const GetImage: Story = {
    play: async ({ canvas, userEvent }) => {
        await expect(canvas.getByTestId('get-image-button')).toBeInTheDocument();
        await userEvent.click(canvas.getByTestId('get-image-button'));
    }
};

export const CloseImage: Story = {
    play: async ({ canvas, userEvent }) => {
        await expect(canvas.getByTestId('close-image-button')).toBeInTheDocument();
        await userEvent.click(canvas.getByTestId('close-image-button'));
    },
    args: {
        enabled: true,
    },
};


export const PreviousImage: Story = {
    play: async ({ canvas, userEvent }) => {
        await expect(canvas.getByTestId('previous-image-button')).toBeInTheDocument();
        await userEvent.click(canvas.getByTestId('previous-image-button'));
    },
    args: {
        enabled: true,
    },
};


export const NextImage: Story = {
    play: async ({ canvas, userEvent }) => {
        await expect(canvas.getByTestId('next-image-button')).toBeInTheDocument();
        await userEvent.click(canvas.getByTestId('next-image-button'));
    },
    args: {
        enabled: true,
    },
};
