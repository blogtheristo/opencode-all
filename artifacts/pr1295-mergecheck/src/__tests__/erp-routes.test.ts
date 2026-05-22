import { beforeEach, describe, expect, test, vi } from 'vitest';
import request from 'supertest';
import express from 'express';

const mockService = {
  configureIntegration: vi.fn(),
  testConnection: vi.fn(),
  getIntegrations: vi.fn(),
  syncProductionOrders: vi.fn(),
  syncMachineData: vi.fn(),
  syncOEEMetrics: vi.fn(),
  syncMaintenanceEvents: vi.fn(),
  resolveCompanyERP: vi.fn(),
  resolveCompanyERPBatch: vi.fn(),
  getAllRegisteredCompanies: vi.fn(),
  getCompaniesByProvider: vi.fn(),
  getSyncHistory: vi.fn(),
  handleWebhook: vi.fn(),
};

const mockApprovalGate = {
  requestApproval: vi.fn(),
  getPendingRequests: vi.fn(),
  approve: vi.fn(),
  reject: vi.fn(),
  getRequest: vi.fn(),
};

vi.mock('../integrations/erp/service.js', () => ({
  ERPIntegrationService: vi.fn().mockImplementation(function ERPIntegrationServiceMock() {
    return mockService;
  }),
}));

vi.mock('../integrations/erp/approval-gate.js', () => ({
  approvalGate: mockApprovalGate,
  ApprovalStatus: {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
  },
}));

const { default: erpRoutes } = await import('../integrations/erp/routes.js');
const app = express();
app.use(express.json());
app.use('/api/v1/erp', erpRoutes);

describe('ERP routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockService.getAllRegisteredCompanies.mockReturnValue([]);
  });

  test('returns 400 for invalid configure payload', async () => {
    const response = await request(app)
      .post('/api/v1/erp/integrations/configure')
      .send({ provider: 'invalid-provider' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
  });

  test('returns registry data', async () => {
    mockService.getAllRegisteredCompanies.mockReturnValue([
      { companyName: 'Acme Oy', provider: 'sap' },
    ]);

    const response = await request(app).get('/api/v1/erp/registry');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: {
        companies: [{ companyName: 'Acme Oy', provider: 'sap' }],
        totalRegistered: 1,
      },
    });
  });

  test('returns approval metadata when sync requires approval', async () => {
    mockApprovalGate.requestApproval.mockResolvedValue({
      id: 'apr-123',
      status: 'pending',
    });

    const response = await request(app).post('/api/v1/erp/sync/production-orders').send({
      organizationId: 'org-1',
      provider: 'sap',
      requestApproval: true,
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: {
        approvalRequired: true,
        approvalRequestId: 'apr-123',
        status: 'pending',
      },
    });
  });
});
