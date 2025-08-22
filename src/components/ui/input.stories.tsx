import type { Meta, StoryObj } from "@storybook/nextjs";
import { Input } from "./input";

const meta: Meta<typeof Input> = {
  title: "Components/ui/Input",
  component: Input,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: StoryObj<typeof Input> = {
  args: {
    placeholder: "Enter text...",
  },
};

// Different states
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Disabled input",
  },
};

export const WithValue: Story = {
  args: {
    value: "Hello world",
  },
};

export const Invalid: Story = {
  args: {
    "aria-invalid": true,
    placeholder: "Invalid input",
  },
};
