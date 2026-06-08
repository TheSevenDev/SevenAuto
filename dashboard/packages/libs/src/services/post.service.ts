import { AxiosInstance } from 'axios';

import { postEndpoints } from '../constants/endpoints/mainApiEndpoints';
import {
  IFindMany,
  IFindManyResponse,
  IPost,
  IPostCreate,
  IPostFindMany,
  IPostSummary,
  IPostUpdate,
} from '../types';
import { removeNullObject, requireApiResponse } from './utils';

export class PostServiceClass {
  private _client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this._client = client;
  }

  public async getPosts(
    filters?: IPostFindMany,
  ): Promise<IFindManyResponse<IPost>> {
    const res = await this._client.request({
      url: postEndpoints.findMany.path,
      method: postEndpoints.findMany.method,
      params: removeNullObject(filters || {}),
    });

    return requireApiResponse<IFindManyResponse<IPost>>(res);
  }

  public async getPostById(id: string): Promise<IPost> {
    const res = await this._client.request({
      url: postEndpoints.findOneById.path.replace('{id}', id),
      method: postEndpoints.findOneById.method,
    });

    return requireApiResponse<IPost>(res);
  }

  public async getPostBySlug(slug: string): Promise<IPost> {
    const res = await this._client.request({
      url: postEndpoints.findOneBySlug.path.replace('{slug}', slug),
      method: postEndpoints.findOneBySlug.method,
    });

    return requireApiResponse<IPost>(res);
  }

  public async getPostBySlugWithDomain(slug: string): Promise<IPost> {
    const res = await this._client.request({
      url: postEndpoints.findOneBySlugWithDomain.path.replace('{slug}', slug),
      method: postEndpoints.findOneBySlugWithDomain.method,
    });

    return requireApiResponse<IPost>(res);
  }

  public async createPost(data: IPostCreate): Promise<IPost> {
    const res = await this._client.request({
      url: postEndpoints.create.path,
      method: postEndpoints.create.method,
      data: removeNullObject(data),
    });

    return requireApiResponse<IPost>(res);
  }

  public async updatePost(id: string, data: IPostUpdate): Promise<IPost> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, ...body } = data;
    const res = await this._client.request({
      url: postEndpoints.update.path.replace('{id}', id),
      method: postEndpoints.update.method,
      data: removeNullObject(body),
    });

    return requireApiResponse<IPost>(res);
  }

  public async deletePost(id: string): Promise<IPost> {
    const res = await this._client.request({
      url: postEndpoints.delete.path.replace('{id}', id),
      method: postEndpoints.delete.method,
    });
    return requireApiResponse<IPost>(res);
  }

  public async summary(filters?: IPostFindMany): Promise<IPostSummary> {
    const res = await this._client.request({
      url: postEndpoints.getPostSummary.path,
      method: postEndpoints.getPostSummary.method,
      params: removeNullObject(filters || {}),
    });

    return requireApiResponse<IPostSummary>(res);
  }

  public async countPost(filters?: IPostFindMany): Promise<number> {
    const res = await this._client.request({
      url: postEndpoints.countPost.path,
      method: postEndpoints.countPost.method,
      params: removeNullObject(filters || {}),
    });

    return requireApiResponse<number>(res);
  }

  public async getPostRevisions(
    id: string,
    filters?: IFindMany,
  ): Promise<IFindManyResponse<IPost>> {
    const res = await this._client.request({
      url: postEndpoints.findManyRevisions.path.replace('{id}', id),
      method: postEndpoints.findManyRevisions.method,
      params: removeNullObject(filters || {}),
    });

    return requireApiResponse<IFindManyResponse<IPost>>(res);
  }

  public async getPostRevision(id: string, revisionId: string): Promise<IPost> {
    const res = await this._client.request({
      url: postEndpoints.getRevisionDetail.path.replace('{id}', id),
      method: postEndpoints.getRevisionDetail.method,
      data: { revisionId },
    });

    return requireApiResponse<IPost>(res);
  }

  public async getSitemap(filters?: IPostFindMany): Promise<IPost[]> {
    const res = await this._client.request({
      url: postEndpoints.sitemap.path,
      method: postEndpoints.sitemap.method,
      params: removeNullObject(filters || {}),
    });

    return requireApiResponse<IPost[]>(res);
  }

  public async getSitemapCount(): Promise<number> {
    const res = await this._client.request({
      url: postEndpoints.sitemapCount.path,
      method: postEndpoints.sitemapCount.method,
    });

    return requireApiResponse<number>(res);
  }

  public async getTrendingPosts(
    filters?: IPostFindMany,
  ): Promise<IFindManyResponse<IPost>> {
    const res = await this._client.request({
      url: postEndpoints.trendingPosts.path,
      method: postEndpoints.trendingPosts.method,
      params: removeNullObject(filters || {}),
    });

    return requireApiResponse<IFindManyResponse<IPost>>(res);
  }

  public async updateStatistic(id: string): Promise<IPost> {
    const res = await this._client.request({
      url: postEndpoints.updateStatistic.path.replace('{id}', id),
      method: postEndpoints.updateStatistic.method,
    });

    return requireApiResponse<IPost>(res);
  }
}
