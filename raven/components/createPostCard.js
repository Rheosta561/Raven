import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import { BlurView } from 'expo-blur';
import { X, ImageIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

const CreatePostCard = ({ isVisible, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.cancelled) {
      setImageUri(result.uri);
    }
  };

  const handlePost = () => {
    onSubmit?.({
      title,
      description,
      tags: tags.split(',').map(tag => tag.trim()),
      imageUri,
    });
    // Optional: clear fields
    setTitle('');
    setDescription('');
    setTags('');
    setImageUri(null);
    onClose();
  };

  return (
    <Modal isVisible={isVisible} backdropOpacity={0.4} style={{ margin: 0 }}>
      <View className="flex-1 justify-center items-center">
        <BlurView intensity={90} tint="dark" className="absolute w-full h-full" />

        <View
          className="bg-black/90 p-4 rounded-2xl w-[90%] border border-zinc-800"
          style={styles.shadow}
        >
          {/* Close Button */}
          <TouchableOpacity onPress={onClose} className="absolute top-3 right-3 z-50">
            <X color="white" size={24} />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text className="text-white text-xl font-semibold text-center mb-4">Create a Post</Text>

            <TextInput
              placeholder="Title"
              placeholderTextColor="#888"
              className="bg-zinc-800 text-white p-3 rounded-lg mb-3"
              value={title}
              onChangeText={setTitle}
            />

            <TextInput
              placeholder="Description"
              placeholderTextColor="#888"
              className="bg-zinc-800 text-white p-3 rounded-lg mb-3"
              multiline
              numberOfLines={4}
              style={{ height: 100, textAlignVertical: 'top' }}
              value={description}
              onChangeText={setDescription}
            />

            <TextInput
              placeholder="Tags (comma separated)"
              placeholderTextColor="#888"
              className="bg-zinc-800 text-white p-3 rounded-lg mb-3"
              value={tags}
              onChangeText={setTags}
            />

            {/* Image Preview */}
            {imageUri && (
              <Image
                source={{ uri: imageUri }}
                className="w-full h-40 rounded-lg mb-3"
                resizeMode="cover"
              />
            )}

            <TouchableOpacity onPress={pickImage} className="flex-row items-center gap-2 bg-zinc-700 p-3 rounded-lg mb-4">
              <ImageIcon color="white" size={18} />
              <Text className="text-white">Upload Image</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handlePost}
              className="bg-white p-3 rounded-lg"
            >
              <Text className="text-black text-center font-semibold text-lg">Post</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
});

export default CreatePostCard;
