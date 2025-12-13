# Demo Components

Thư mục này chứa các demo pages để test UI components chính thức với sidebar navigation, **sử dụng trực tiếp components gốc**.

## 🎯 **Demo Approach - Sử dụng Components Gốc**

### ✅ **Lợi ích chính:**

- **🔄 Đồng bộ 100%**: Demo sử dụng trực tiếp components từ `components/campaigns/`
- **⚡ Real-time Updates**: Khi chỉnh sửa component gốc, demo tự động cập nhật
- **📚 Documentation Sync**: Tương thích với `docs/ui/campaigns.md`
- **🚀 Development Friendly**: Dễ dàng test và debug components thực tế

### ❌ **Tránh xa:**

- Tạo demo components riêng biệt (sẽ không đồng bộ)
- Copy-paste code từ components gốc
- Maintain 2 versions của cùng 1 component

## 📁 Cấu trúc thư mục

```
demo/
├── components/           # Demo components (nếu cần)
│   ├── campaigns/       # Campaign-related demos
│   └── index.ts         # Main demo exports
└── README.md            # This file

app/demo/                 # Demo pages (sử dụng components gốc)
├── layout.tsx           # Sidebar navigation layout
├── page.tsx             # Demo index
├── campaign-card-demo/  # Campaign Card demo (sử dụng CampaignCard gốc)
├── campaign-form-demo/  # Campaign Form demo (sử dụng CampaignForm gốc)
└── ...                  # Các demo pages khác
```

## 🎯 Mục đích

- **Tách biệt**: Demo pages không ảnh hưởng đến production code
- **Dễ quản lý**: Cấu trúc rõ ràng, dễ tìm kiếm
- **Đồng bộ hoàn hảo**: Luôn sử dụng components gốc mới nhất
- **Testing**: Test UI components thực tế trước khi tích hợp
- **Navigation**: Sidebar navigation để dễ dàng chuyển đổi giữa các demo

## 🚀 Cách sử dụng

### 1. **Demo Pages (Khuyến nghị)**

```tsx
// Truy cập trực tiếp demo pages
URL: /demo/aacgimnp - card - demo;
URL: /demo/aacgimnp - form - demo;
// ... các demo khác
```

### 2. **Import Components Gốc (Nếu cần)**

```tsx
// Sử dụng components gốc, không phải demo components
import { CampaignCard } from '@/components/campaigns/campaign-card';
import { CampaignForm } from '@/components/campaigns/campaign-form';
```

### 3. **Truy cập demo pages (với sidebar navigation)**

```
URL: /demo                           # Demo index với sidebar
URL: /demo/campaign-card-demo        # Campaign Card demo
URL: /demo/campaign-form-demo        # Campaign Form demo
URL: /demo/campaign-filters-demo     # Campaign Filters demo
URL: /demo/campaign-table-demo       # Campaign Table demo
URL: /demo/campaign-search-demo      # Campaign Search demo
URL: /demo/campaign-creation-modal-demo  # Campaign Creation Modal demo
URL: /demo/campaign-status-selector-demo  # Campaign Status Selector demo
```

## 🎭 Sidebar Navigation Features

### 📱 **Collapsible Sidebar**

- **Expand/Collapse**: Click button để thu gọn/mở rộng sidebar
- **Responsive**: Tự động điều chỉnh theo screen size
- **Smooth Animation**: Transition mượt mà khi thay đổi kích thước

### 🗂️ **Module Organization**

- **Campaigns**: Campaign management components
- **Content**: Content management components
- **Schedules**: Scheduling và calendar components
- **Members**: Team member management
- **Analytics**: Analytics và reporting
- **UI Components**: Basic UI components

### 🎯 **Quick Navigation**

- **Active State**: Highlight component đang được xem
- **Descriptions**: Mô tả ngắn cho mỗi component
- **Icons**: Visual indicators cho từng module
- **Hover Effects**: Interactive feedback

## 📋 Campaign Components Available

### 🎯 Core Components (Sử dụng trực tiếp từ gốc)

- **CampaignCard**: `components/campaigns/campaign-card.tsx`
- **CampaignForm**: `components/campaigns/campaign-form.tsx`
- **CampaignFilters**: `components/campaigns/campaign-filters.tsx`
- **CampaignTable**: `components/campaigns/campaign-table.tsx`
- **CampaignSearch**: `components/campaigns/campaign-search.tsx`
- **CampaignCreationModal**: `components/campaigns/campaign-creation-modal.tsx`
- **CampaignStatusSelector**: `components/campaigns/campaign-status-selector.tsx`

### 🎨 Features

- **Responsive Design**: Mobile-first approach
- **Interactive Elements**: Hover effects, animations
- **Mock Data**: Sample data để test
- **Real Components**: Test trực tiếp production code
- **Documentation Sync**: Tương thích với docs/ui/campaigns.md

## 📋 Quy tắc đặt tên

- **Demo pages**: Thêm suffix `-demo` (ví dụ: `campaign-card-demo`)
- **Components**: Luôn sử dụng components gốc, không tạo demo components
- **Index files**: Luôn có `index.ts` để export (nếu cần)

## 🔄 Cập nhật

Khi thêm demo mới:

1. **Tạo demo page** trong `app/demo/` (Next.js routes)
2. **Sử dụng component gốc** từ `components/campaigns/`
3. **Thêm vào `demoModules`** array trong `app/demo/layout.tsx`
4. **Cập nhật README** này nếu cần
5. **Không tạo demo components** riêng biệt

## 🏗️ Kiến trúc

```
demo/                          # Demo components (nếu cần)
├── components/campaigns/      # Demo components (tránh sử dụng)
└── README.md                 # Documentation

app/demo/                      # Next.js routes (pages)
├── layout.tsx                # Sidebar navigation layout
├── page.tsx                  # Demo index
├── campaign-card-demo/       # Campaign Card demo (sử dụng CampaignCard gốc)
├── campaign-form-demo/       # Campaign Form demo (sử dụng CampaignForm gốc)
└── ...                       # Các demo pages khác
```

## 🎨 UI/UX Features

### **Sidebar Design**

- **Clean Layout**: Minimalist design với clear hierarchy
- **Color Coding**: Blue theme cho active states
- **Typography**: Consistent font sizes và weights
- **Spacing**: Proper spacing giữa các elements

### **Navigation Experience**

- **Visual Feedback**: Hover effects và active states
- **Smooth Transitions**: CSS transitions cho interactions
- **Responsive Behavior**: Adapts to different screen sizes
- **Accessibility**: Proper focus states và keyboard navigation

## 🚨 **Quan trọng: Tránh xa Demo Components**

### ❌ **Không làm:**

```tsx
// KHÔNG tạo demo components riêng biệt
import { CampaignCardDemo } from '@/demo/components/campaigns';

// KHÔNG copy-paste code từ components gốc
```

### ✅ **Nên làm:**

```tsx
// LUÔN sử dụng components gốc
import { CampaignCard } from '@/components/campaigns/campaign-card';

// Tạo demo pages để test components gốc
export default function CampaignCardDemoPage() {
   return (
      <div>
         <CampaignCard campaign={mockData} orgId="demo" />
      </div>
   );
}
```

---

_Last Updated: 2025-01-02_
_Maintainer: Development Team_
