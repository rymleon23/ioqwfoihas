'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
   Target,
   Filter,
   Table,
   Search,
   Plus,
   Settings,
   FileText,
   Calendar,
   Users,
   BarChart3,
   Layout,
} from 'lucide-react';

const campaignComponents = [
   {
      id: 'campaign-card-demo',
      title: 'Campaign Card',
      description: 'Card layout với hover effects và responsive design',
      features: ['Grid Layout', 'Single Card', 'Hover Effects', 'Responsive Design'],
      icon: Target,
      sourceFile: 'components/campaigns/campaign-card.tsx',
   },
   {
      id: 'campaign-form-demo',
      title: 'Campaign Form',
      description: 'Form creation với validation và submission',
      features: ['Form Validation', 'Data Submission', 'Responsive Layout'],
      icon: Target,
      sourceFile: 'components/campaigns/campaign-form.tsx',
   },
   {
      id: 'campaign-filters-demo',
      title: 'Campaign Filters',
      description: 'Filter options và controls cho campaigns',
      features: ['Status Filter', 'Priority Filter', 'Team Filter', 'Date Range'],
      icon: Filter,
      sourceFile: 'components/campaigns/campaign-filters.tsx',
   },
   {
      id: 'campaign-table-demo',
      title: 'Campaign Table',
      description: 'Data table với sorting và actions',
      features: ['Data Table', 'Sorting', 'Actions', 'Responsive'],
      icon: Table,
      sourceFile: 'components/campaigns/campaign-table.tsx',
   },
   {
      id: 'campaign-search-demo',
      title: 'Campaign Search',
      description: 'Search functionality với query handling',
      features: ['Search Input', 'Query Handling', 'Responsive Design'],
      icon: Search,
      sourceFile: 'components/campaigns/campaign-search.tsx',
   },
   {
      id: 'campaign-creation-modal-demo',
      title: 'Campaign Creation Modal',
      description: 'Modal dialog cho campaign creation',
      features: ['Modal Dialog', 'Form Integration', 'Overlay'],
      icon: Plus,
      sourceFile: 'components/campaigns/campaign-creation-modal.tsx',
   },
   {
      id: 'campaign-status-selector-demo',
      title: 'Campaign Status Selector',
      description: 'Status selection với single/multiple options',
      features: ['Single Selection', 'Multiple Selection', 'Status Options'],
      icon: Settings,
      sourceFile: 'components/campaigns/campaign-status-selector.tsx',
   },
];

export default function DemoIndexPage() {
   return (
      <div className="p-8">
         <div className="max-w-6xl mx-auto">
            <div className="mb-8">
               <h1 className="text-4xl font-bold text-foreground mb-4">
                  🎭 Campaign Components Demo
               </h1>
               <p className="text-xl text-muted-foreground">
                  Sử dụng sidebar bên trái để navigate giữa các demo components
               </p>
            </div>

            {/* Approach Explanation */}
            <div className="mb-8 p-6 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
               <h2 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
                  🎯 Demo Approach - Sử dụng Components Gốc
               </h2>
               <div className="space-y-2 text-sm text-green-800 dark:text-green-200">
                  <p>
                     • <strong>Đồng bộ 100%:</strong> Demo sử dụng trực tiếp components từ
                     components/campaigns/
                  </p>
                  <p>
                     • <strong>Real-time Updates:</strong> Khi chỉnh sửa component gốc, demo tự động
                     cập nhật
                  </p>
                  <p>
                     • <strong>Documentation Sync:</strong> Tương thích với docs/ui/campaigns.md
                  </p>
                  <p>
                     • <strong>Development Friendly:</strong> Dễ dàng test và debug components thực
                     tế
                  </p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {campaignComponents.map((component) => {
                  const IconComponent = component.icon;
                  return (
                     <Card
                        key={component.id}
                        className="hover:shadow-lg transition-shadow border-border"
                     >
                        <CardHeader>
                           <CardTitle className="flex items-center gap-2">
                              <IconComponent className="h-5 w-5 text-primary" />
                              {component.title}
                           </CardTitle>
                           <CardDescription className="text-sm text-muted-foreground">
                              {component.description}
                           </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                           <div className="space-y-2">
                              <h4 className="font-medium text-sm text-foreground">Features:</h4>
                              <div className="flex flex-wrap gap-1">
                                 {component.features.map((feature) => (
                                    <span
                                       key={feature}
                                       className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20"
                                    >
                                       {feature}
                                    </span>
                                 ))}
                              </div>
                           </div>

                           <div className="text-sm text-muted-foreground">
                              <p>
                                 <strong>Source:</strong> {component.sourceFile}
                              </p>
                           </div>

                           <div className="text-sm text-muted-foreground">
                              <p>
                                 💡 <strong>Tip:</strong> Sử dụng sidebar để navigate nhanh!
                              </p>
                           </div>
                        </CardContent>
                     </Card>
                  );
               })}
            </div>

            <div className="mt-12 p-6 bg-card rounded-lg border border-border">
               <h3 className="text-lg font-semibold text-foreground mb-3">
                  📚 Demo Navigation Guide
               </h3>
               <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                     <strong>Sidebar Navigation:</strong> Sử dụng sidebar bên trái để chuyển đổi
                     giữa các demo
                  </p>
                  <p>
                     <strong>Module Organization:</strong> Components được phân loại theo module
                     (Campaigns, Content, Schedules, etc.)
                  </p>
                  <p>
                     <strong>Quick Access:</strong> Click vào component trong sidebar để xem demo
                     ngay lập tức
                  </p>
                  <p>
                     <strong>Collapsible:</strong> Có thể thu gọn sidebar để có thêm không gian xem
                     demo
                  </p>
                  <p>
                     <strong>Real Components:</strong> Tất cả demo đều sử dụng components gốc từ
                     production code
                  </p>
               </div>
            </div>

            {/* Benefits */}
            <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
               <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                  🚀 Lợi ích của Approach này
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-200">
                  <div>
                     <h4 className="font-medium mb-2">🔄 Đồng bộ hoàn hảo</h4>
                     <ul className="space-y-1">
                        <li>• Components luôn up-to-date</li>
                        <li>• Không cần maintain demo riêng</li>
                        <li>• Test trực tiếp production code</li>
                     </ul>
                  </div>
                  <div>
                     <h4 className="font-medium mb-2">⚡ Development Speed</h4>
                     <ul className="space-y-1">
                        <li>• Test ngay khi code thay đổi</li>
                        <li>• Debug dễ dàng hơn</li>
                        <li>• Không cần switch context</li>
                     </ul>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
