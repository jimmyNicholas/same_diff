import { Meta, StoryObj } from "@storybook/react";
import LessonForm from "@/components/admin/lesson/LessonForm";

const meta: Meta<typeof LessonForm> = {
  title: "Admin/Lesson/LessonForm",
  component: LessonForm,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    username: 'admin',
    onCancel: () => {},
    onSave: () => {},
  },
};
