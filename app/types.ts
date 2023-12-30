type ImageEdge = {
  node: {
    originalSrc: string;
  };
};

type ProductNode = {
  id: string;
  title: string;
  description: string;
  images: {
    edges: ImageEdge[];
  };
};

export type ProductEdge = {
  node: ProductNode;
};
