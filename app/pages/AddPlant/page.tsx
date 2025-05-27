"use client";
import React, { useState, useRef } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CreatePlant } from "@/app/actions/getplant.action";
import { Loader2 } from "lucide-react";
import { UploadImage } from "@/lib/uploadimg";

const AddPlantPage=() => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (e.g., 5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }
      
      // Validate file type
      if (!file.type.match("image.*")) {
        setError("Please upload an image file");
        return;
      }

      setError(null);
      setImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!image) {
        throw new Error("Please upload an image");
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("quantity", quantity);
      formData.append("category", category);


      const imageUrl = await UploadImage(image as File, 'plants');
      if (!imageUrl || typeof imageUrl !== "string") {
        throw new Error("Failed to upload image");
      }

      formData.append("imageUrl", imageUrl);

      const response = await CreatePlant(formData);

      if (!response.success) {
        throw new Error(response.message || "Failed to add plant");
      }

      // Reset form on success
      setName("");
      setDescription("");
      setPrice("");
      setQuantity("");
      setCategory("");
      setImage(null);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      alert("Plant added successfully!");
    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "Failed to add plant");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 py-6 text-center text-green-500">
          Add New Plant
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-8 rounded-lg shadow-md p-6"
        >
          {/* Left side - Image upload */}
          <div className="w-full md:w-1/2">
            <div
              className="border-2 rounded-lg p-4 flex flex-col items-center justify-center h-96 cursor-pointer"
              onClick={triggerFileInput}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Plant preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">
                    Click to upload an image
                  </p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
                ref={fileInputRef}
                required
              />
            </div>
            <Button
              variant="outline"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerFileInput();
              }}
              className="mt-4 w-full"
              disabled={isSubmitting}
            >
              {preview ? "Change Image" : "Upload Image"}
            </Button>
            {error && !preview && (
              <p className="mt-2 text-sm text-red-500">{error}</p>
            )}
          </div>

          {/* Right side - Form fields */}
          <div className="w-full md:w-1/2 space-y-6">
            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}

            <div>
              <Label htmlFor="name" className="mb-2">
                Plant Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter plant name"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="description" className="mb-2">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter plant description"
                rows={4}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price" className="mb-2">
                  Price ($)
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="quantity" className="mb-2">
                  Quantity
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="0"
                  min="0"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="category" className="mb-2">
                Category
              </Label>
              <Select
                onValueChange={(value) => setCategory(value)}
                value={category}
                required
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="indoor">Indoor Plants</SelectItem>
                  <SelectItem value="outdoor">Outdoor Plants</SelectItem>
                  <SelectItem value="succulent">Succulent Plants</SelectItem>
                  <SelectItem value="herbs">Herbs</SelectItem>
                  <SelectItem value="flowers">Flowering Plants</SelectItem>
                  <SelectItem value="trees">Trees</SelectItem>
                  <SelectItem value="cacti">Cacti</SelectItem>
                  <SelectItem value="ferns">Ferns</SelectItem>
                  <SelectItem value="palms">Palms</SelectItem>
                  <SelectItem value="bamboo">Bamboo</SelectItem>
                  <SelectItem value="orchids">Orchids</SelectItem>
                  <SelectItem value="carnivorous">
                    Carnivorous Plants
                  </SelectItem>
                  <SelectItem value="airplants">Air Plants</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Plant...
                </>
              ) : (
                "Add Plant"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPlantPage;