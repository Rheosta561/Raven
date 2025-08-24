// /components/MyButton.jsx
import { Text, TouchableOpacity } from 'react-native';

export default function MyButton({ label, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} className="px-4 py-2 bg-blue-500 rounded-lg">
      <Text className="text-white font-semibold">{label}</Text>
    </TouchableOpacity>
  );
}
