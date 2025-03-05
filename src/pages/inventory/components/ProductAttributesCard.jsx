import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';

const ProductAttributesCard = ({ product, attributes }) => {
  return (
    <Card elevation={1} sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Product Attributes
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <List dense disablePadding>
          {product.attributes?.length > 0 ? (
            product.attributes.map((attr) => {
              const attributeInfo = attributes.find(a => a.id === attr.id);
              return (
                <ListItem key={attr.id} disablePadding sx={{ py: 1 }}>
                  <ListItemText
                    primary={attributeInfo?.attribute_name || 'Unknown Attribute'}
                    secondary={`${attr.pivot.value} ${attributeInfo?.unit_of_measurement || ''}`}
                  />
                </ListItem>
              );
            })
          ) : (
            <ListItem disablePadding>
              <ListItemText primary="No attributes defined" />
            </ListItem>
          )}
        </List>
      </CardContent>
    </Card>
  );
};

export default ProductAttributesCard;