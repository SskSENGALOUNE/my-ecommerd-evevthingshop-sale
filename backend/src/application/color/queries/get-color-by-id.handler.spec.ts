import { NotFoundException } from "@nestjs/common";
import { GetColorByIdHandler } from "./get-color-by-id.handler";
import { GetColorByIdQuery } from "./get-color-by-id.query";
import type { IColorRepository } from "../../../domain/color/color.repository";

describe("GetColorByIdHandler", () => {
  let handler: GetColorByIdHandler;
  let repo: jest.Mocked<IColorRepository>;

  beforeEach(() => {
    repo = {
      create: jest.fn(),
      findByColor: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    handler = new GetColorByIdHandler(repo);
  });

  it("returns color when it exists", async () => {
    const colorId = "uuid-1";
    const color = {
      id: colorId,
      color: "RED",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    repo.findById.mockResolvedValue(color);

    const result = await handler.execute(new GetColorByIdQuery(colorId));

    expect(result.id).toBe(colorId);
    expect(result.color).toBe("RED");
    expect(repo.findById).toHaveBeenCalledWith(colorId);
  });

  it("throws NotFoundException when color does not exist", async () => {
    repo.findById.mockResolvedValue(null);

    await expect(
      handler.execute(new GetColorByIdQuery("uuid-999")),
    ).rejects.toThrow(NotFoundException);
  });
});
