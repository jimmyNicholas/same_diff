import { Meta, StoryObj } from "@storybook/nextjs";
import Picture from "./picture";

const meta = {
  component: Picture,
  title: "Picture",
  tags: ["autodocs"],
  args: {
    enabled: false,
    loading: false,
    src: "/images/placeholder.jpg",
    alt: "Placeholder Image",
    size: "md",
  },
  argTypes: {
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
